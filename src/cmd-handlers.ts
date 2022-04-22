import {Entity, ActionDetails, SdkParams} from "./types"
import {perform_tasks} from "./utils"

function make_actions(sdk_params: SdkParams, action_details: ActionDetails, sdk: Record<string, any>) {
    const {subpath} = sdk_params.rest
    const {before, after, cb_name} = action_details

    async function load(this: any, msg: any) {
        let body = {...msg.q}

        const context = {
            inent: msg.ent,
            request: body,
            query: msg.q,
        }

        if (before) {
            perform_tasks(before, context)
        }

        if (subpath === 'token') {

            const mockResponse = await sdk.nordigenClient[cb_name](body)
            let entity: Entity = this.make$(msg.ent.entity$).data$({res: mockResponse})

            if (after) {
                perform_tasks(after, {
                    ...context,
                    outent: entity,
                    response: mockResponse
                })
            }
            return entity
        } else {
            const mockResponse = await sdk.nordigenClient[subpath][cb_name](body)
            let entity: Entity = this.make$(msg.ent.entity$).data$({res: mockResponse})

            if (after) {
                perform_tasks(after, {
                    ...context,
                    outent: entity,
                    response: mockResponse
                })
            }
            return entity
        }

    }

    return {
        load,
    }
}


export {make_actions}
