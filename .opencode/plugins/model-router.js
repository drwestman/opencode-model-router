export const ModelRouterPlugin = async (ctx) => {
  const pluginModule = await import("../../index.cjs");
  return pluginModule.default(ctx);
};
export default ModelRouterPlugin;
