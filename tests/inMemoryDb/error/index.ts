export class InMemoryErrorDatabase extends Error {
  constructor(input: string) {
    super()

    this.name = 'InMemoryDatabase Error'
    this.message = input
  }
}
