declare class Service {
  constructor()
  sequencer(n: SequenceRequest, callback?: (n: SequenceResponse) => void): SequenceResponse
  sequencer(callback?: (n: SequenceResponse) => void): SequenceResponse 
}

declare interface SequenceRequest {
  A: Number
  PageToken?: string
}

declare interface SequenceResponse {
  B: Number[]
  NextPageToken?: string
}

interface PageableResponse {
  NextPageToken?: string
}

interface PageableRequest {
  PageToken?: string
}

type Lister<T extends PageableRequest, U extends PageableResponse> = (
  params: T,
  callback?: (data: U) => void
) => U

declare function All<T, U, V>(
  lister: Lister<T, U>,
  fn: (obj: U) => V[] | undefined,
  init?: T
): Promise<Array<V>> 

export async function main() {
  const myService = {} as Service
  const result = await All(myService.sequencer, r => r.B)
}
