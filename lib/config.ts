interface Config {
  alchemyApiKey: string;
  alchemyUrl: string;
  env: Environment;
}

export type Environment = "local" | "staging" | "production";
const config: Config = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
  alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_URL || "",
  env: (process.env.NEXT_PUBLIC_ENV as Environment) || "local",
};

export default config;
