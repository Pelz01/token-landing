import { NextResponse } from "next/server";

type LaunchPayload = {
  tokenName: string;
  symbol: string;
  description: string;
  contractAddress?: string;
  imageUrl: string;
  websiteUrl?: string;
  xUrl?: string;
  telegramUrl?: string;
  walletAddress: string;
  launchWallet: string;
  initialBuyInSol: string;
  feeBps: string;
};

function createMockResponse(payload: LaunchPayload) {
  return {
    mode: "mock" as const,
    message:
      "Bags API key not configured. Returning a hackathon-safe mock payload so you can wire the full UX first.",
    tokenInfo: {
      name: payload.tokenName,
      symbol: payload.symbol,
      uriPreview: payload.imageUrl,
    },
    feeShare: {
      basisPoints: Number(payload.feeBps),
      claimer: payload.walletAddress,
      split: "100%",
    },
    launch: {
      payer: payload.launchWallet,
      initialBuyInSol: payload.initialBuyInSol,
      nextStep: "Connect wallet and sign serialized transactions.",
    },
  };
}

async function bagsFetch<T>(path: string, body: BodyInit, headers?: Record<string, string>) {
  const apiKey = process.env.BAGS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BAGS_API_KEY");
  }

  const response = await fetch(`https://public-api-v2.bags.fm/api/v1${path}`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      ...headers,
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || `Bags request failed for ${path}`);
  }

  return data;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LaunchPayload;

    if (!payload.tokenName || !payload.symbol || !payload.description) {
      return NextResponse.json(
        { error: "Token name, symbol, and description are required." },
        { status: 400 },
      );
    }

    if (!payload.walletAddress || !payload.launchWallet) {
      return NextResponse.json(
        { error: "Creator wallet and launch wallet are required." },
        { status: 400 },
      );
    }

    if (!process.env.BAGS_API_KEY) {
      return NextResponse.json(createMockResponse(payload));
    }

    const tokenInfoForm = new FormData();
    tokenInfoForm.append("name", payload.tokenName);
    tokenInfoForm.append("symbol", payload.symbol);
    tokenInfoForm.append("description", payload.description);
    tokenInfoForm.append("imageUrl", payload.imageUrl);
    if (payload.websiteUrl) tokenInfoForm.append("website", payload.websiteUrl);
    if (payload.xUrl) tokenInfoForm.append("twitter", payload.xUrl);
    if (payload.telegramUrl) tokenInfoForm.append("telegram", payload.telegramUrl);

    const tokenInfo = await bagsFetch("/token-launch/create-token-info", tokenInfoForm);

    const feeShare = await bagsFetch(
      "/fee-share/config",
      JSON.stringify({
        tokenMint: payload.contractAddress || "",
        feeShareName: `${payload.tokenName} Creator Split`,
        feeClaimer: payload.walletAddress,
        feeRecipients: [
          {
            walletAddress: payload.walletAddress,
            basisPoints: Number(payload.feeBps),
          },
        ],
        admin: payload.launchWallet,
      }),
      {
        "Content-Type": "application/json",
      },
    );

    const feeShareConfigKey =
      (feeShare as { response?: { meteoraConfigKey?: string } }).response?.meteoraConfigKey;

    const launch = await bagsFetch(
      "/token-launch/create-launch-transaction",
      JSON.stringify({
        payer: payload.launchWallet,
        tokenInfo: (tokenInfo as { response?: unknown }).response ?? tokenInfo,
        configKey: feeShareConfigKey,
        buyAmountSol: Number(payload.initialBuyInSol),
      }),
      {
        "Content-Type": "application/json",
      },
    );

    return NextResponse.json({
      mode: "live" as const,
      message: "Bags launch payload prepared. Next step is wallet signing on the frontend.",
      tokenInfo,
      feeShare,
      launch,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to prepare the Bags launch flow.",
      },
      { status: 500 },
    );
  }
}
