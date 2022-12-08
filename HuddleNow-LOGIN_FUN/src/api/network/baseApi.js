import { process } from "./helper";

class BaseApi {
  constructor(config, isExternalApi = false) {
    this.config = config;
    this.isExternalApi = isExternalApi;
  }

  execute() {
    return process({
      config: this.config,
      isExternalApi: this.isExternalApi,
    });
  }
}

export default BaseApi;
