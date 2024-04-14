const { JsonwebtokenAdapter } = require("../../dist/functions/authGatewayFnc/app/adapters/jsonwebtoken/index")
const { KeysEnum } = require("../../dist/functions/authGatewayFnc/app/repositories/keyRepo")
const { FirestoreService } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore")
const { FirestoreKey } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore/repositories/keyRepo")
const { Adapters } = require("../../dist/functions/authGatewayFnc/app/adapters")
const { TraceHandler } = require("../../dist/functions/authGatewayFnc/infra/configs/tracing")

class GenToken {
  jwtAdapter = new JsonwebtokenAdapter()

  adapters = new Adapters()
  tracer = new TraceHandler()
  firestoreService = new FirestoreService()
  firestoreKey = new FirestoreKey(
    this.firestoreService, this.adapters,
    this.tracer
  )

  exec() {
    this.firestoreKey.getSignature(KeysEnum.ACCESS_TOKEN_KEY)
      .then((key) => {
        const token = this.jwtAdapter.build(
          { sub: '1465520e-f8be-445c-a8e6-34f708afc513' },
          key.actual.content,
          new Date(Date.now() + 1000 * 60 * 60 * 24)
        )
        console.log('GENERATED TOKEN: ', token)
      })
  }
}

new GenToken().exec()
