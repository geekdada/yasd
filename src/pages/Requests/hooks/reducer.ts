import { Reducer, useReducer } from 'react'

import { RequestItem } from '@/types'

enum RequestListActions {
  LOAD_REQUESTS = 'LOAD_REQUESTS',
  UPDATE_REQUEST = 'UPDATE_REQUEST',
  RESET = 'RESET',
}

type RequestListState = {
  requestList: RequestItem[] | undefined
  lastUpdated?: Date
}

type RequestListReducerAction =
  | {
      type: RequestListActions.LOAD_REQUESTS
      payload: RequestItem[]
    }
  | {
      type: RequestListActions.UPDATE_REQUEST
      payload: RequestItem
    }
  | {
      type: RequestListActions.RESET
    }

const requestListReducer: Reducer<
  RequestListState,
  RequestListReducerAction
> = (state, action) => {
  switch (action.type) {
    case RequestListActions.LOAD_REQUESTS: {
      const currentList = state.requestList ? [...state.requestList] : []
      const newItems: RequestItem[] = []
      const insertMethod = currentList.length > 0 ? 'unshift' : 'push'

      for (const request of action.payload) {
        const index = currentList.findIndex((item) => item.id === request.id)
        const now = new Date()

        if (index === -1) {
          newItems.push({
            ...request,
            lastUpdated: now,
          })
        } else {
          Object.assign(currentList[index], {
            ...request,
            lastUpdated: now,
          })
        }
      }

      currentList[insertMethod](...newItems)

      return {
        ...state,
        requestList: currentList,
        lastUpdated: new Date(),
      }
    }

    case RequestListActions.UPDATE_REQUEST:
      if (!state.requestList) {
        return state
      }

      return {
        ...state,
        requestList: state.requestList.map((request) => {
          if (request.id === action.payload.id) {
            return action.payload
          }
          return request
        }),
        lastUpdated: new Date(),
      }

    case RequestListActions.RESET:
      return {
        ...state,
        requestList: [],
        lastUpdated: new Date(),
      }
    default:
      throw new Error(`Unknown action type: ${action}`)
  }
}

const useRequestListReducer = () =>
  useReducer(requestListReducer, {
    requestList: undefined,
    lastUpdated: undefined,
  })

export { useRequestListReducer, RequestListActions }
