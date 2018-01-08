import * as AWS from 'aws-sdk'
import { isUndefined } from 'util'

export async function DoSomething(): Promise<Array<string>> {
  const principalARNs = new Array<string>()

  const serviceCatalog = new AWS.ServiceCatalog()
  const portfolioDetails = await Util.All(serviceCatalog.listPortfolios, r => r.PortfolioDetails)

  for (const portfolioDetail of portfolioDetails) {
    if (isUndefined(portfolioDetail.Id)) {
      throw new Error('Portfolio ID is undefined')
    }

    const principals = await Util.All(serviceCatalog.listPrincipalsForPortfolio, r => r.Principals, { PortfolioId: portfolioDetail.Id })
    principalARNs.push(...principals.map(p => p.PrincipalARN))
  }

  return principalARNs
}

export namespace Util {
  
    export interface PageableResponse {
      NextPageToken?: string
    }
    
    export interface PageableRequest {
      PageToken?: string
    }
  
    export type Callback<U> = (err: AWS.AWSError, data: U) => void
  
    export type Lister<T extends PageableRequest, U extends PageableResponse> = (
      params: T,
      callback?: Callback<U>
    ) => AWS.Request<U, AWS.AWSError>
  
    export async function All<T, U extends PageableResponse, V> (
      lister: Lister<T, U>,
      fn: (obj: U) => V[] | undefined,
      init = {} as T
    ): Promise<Array<V>> {
      const list = new Array<V[]>()
      let params = init as PageableRequest
      do {
        const response = (await lister(params as T).promise())
        list.push((fn(response) || []))
        params = { PageToken: response.NextPageToken }
      } while (!isUndefined(params.PageToken))
      return list.reduce((a, b) => a.concat(b), [])
    }
  
    export function isDefined<T> (x: T | undefined): x is T {
      return !isUndefined(x)
    }
  }