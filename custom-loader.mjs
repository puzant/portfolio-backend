import generateAliasesResolver from 'esm-module-alias'; 
const aliases = {
  "@controllers": "./controllers",
  "@services": "./services",
  "@routes": "./routes",
  "@validations": "./validations",
  "@models": "./models",
  "@middlewares": "./middlewares",
  "@utils": "./utils"
};

export const resolve = generateAliasesResolver(aliases);