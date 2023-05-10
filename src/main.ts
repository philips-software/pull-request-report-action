import * as core from '@actions/core'
import { run } from './run'
import { config } from './action.config.args'

const main = async (): Promise<void> => {
  await run(config)
}

main().catch((e) => core.setFailed(e instanceof Error ? e : String(e)))
