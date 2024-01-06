import { AppEnv } from "../../../../types";
import { EnvConfigs } from "../type";
import { productionConfigs } from "./_production.configs";

export const configs: EnvConfigs = {
  [AppEnv.PRODUCTION]: productionConfigs,
}