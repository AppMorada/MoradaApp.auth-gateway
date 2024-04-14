const { JsonwebtokenAdapter } = require("../../dist/functions/authGatewayFnc/app/adapters/jsonwebtoken/index")
const { FirestoreService } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore")
const { FirestoreKey } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore/repositories/keyRepo")
const { Adapters } = require("../../dist/functions/authGatewayFnc/app/adapters")
const { TraceHandler } = require("../../dist/functions/authGatewayFnc/infra/configs/tracing")

class SeedRouteMap {
  jwtAdapter = new JsonwebtokenAdapter()

  adapters = new Adapters()
  tracer = new TraceHandler()
  firestoreService = new FirestoreService()
  firestoreKey = new FirestoreKey(
    this.firestoreService, this.adapters,
    this.tracer
  )

  exec() {
    console.log('Adding registryapi service')
    const collection = this.firestoreService.instance.collection('route-map')
    collection.doc('registryapi').set({
      url: process.env.URL_TO_REDIRECT,
      aclRoleBased: 1
    })
  }
}

new SeedRouteMap().exec()
