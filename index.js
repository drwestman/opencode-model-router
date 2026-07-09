import pluginModule from "./index.cjs";

const pluginExport =
  typeof pluginModule === "function" ? pluginModule : pluginModule.default;

export default pluginExport;
export const server = pluginExport.server;
export const version = pluginExport.version;
export const applyPersistedState = pluginExport.applyPersistedState;
export const buildAgentDefinition = pluginExport.buildAgentDefinition;
export const buildCapBanner = pluginExport.buildCapBanner;
export const buildDelegationProtocol = pluginExport.buildDelegationProtocol;
export const buildModeOutput = pluginExport.buildModeOutput;
export const buildPresetOutput = pluginExport.buildPresetOutput;
export const composePrompt = pluginExport.composePrompt;
export const detectNarration = pluginExport.detectNarration;
export const extractDispatchText = pluginExport.extractDispatchText;
export const invalidateConfigCache = pluginExport.invalidateConfigCache;
export const loadConfigFromPaths = pluginExport.loadConfigFromPaths;
export const normalizeRouterState = pluginExport.normalizeRouterState;
export const parseCapDirective = pluginExport.parseCapDirective;
export const readStateFile = pluginExport.readStateFile;
export const registerActiveTierAgents = pluginExport.registerActiveTierAgents;
export const resolvePresetName = pluginExport.resolvePresetName;
export const resolveRouterPaths = pluginExport.resolveRouterPaths;
export const routerBuildInfo = pluginExport.routerBuildInfo;
export const routerVersion = pluginExport.routerVersion;
export const tui = pluginExport.tui;
export const validateConfig = pluginExport.validateConfig;
export const writeStateFile = pluginExport.writeStateFile;
