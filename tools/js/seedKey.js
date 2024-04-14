const { JsonwebtokenAdapter } = require("../../dist/functions/authGatewayFnc/app/adapters/jsonwebtoken/index")
const { FirestoreService } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore")
const { FirestoreKey } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore/repositories/keyRepo")
const { Adapters } = require("../../dist/functions/authGatewayFnc/app/adapters")
const { TraceHandler } = require("../../dist/functions/authGatewayFnc/infra/configs/tracing")
const { FirestoreKeyMapper } = require("../../dist/functions/authGatewayFnc/infra/storage/firestore/mapper/key")
const { randomUUID, randomBytes } = require('crypto')
const { Key } = require("../../dist/functions/authGatewayFnc/app/entities/key")

class SeedKey {
        signatures = [
                'ACCESS_TOKEN_KEY'
        ]
        jwtAdapter = new JsonwebtokenAdapter()

        adapters = new Adapters()
        tracer = new TraceHandler()
        firestoreService = new FirestoreService()
        firestoreKey = new FirestoreKey(
            this.firestoreService, this.adapters,
            this.tracer
        )

        async send() {
                for (const key of this.signatures) {
                        const data = FirestoreKeyMapper.toFlat(new Key({
                                id: randomUUID(),
                                name: key,
                                actual: {
                                        content: randomBytes(100).toString('hex'),
                                        buildedAt: Date.now()
                                },
                                ttl: 1000 * 60 * 60 * 24 * 30,
                        }))


                        const collection = this.firestoreService.instance.collection('secrets')
                        await collection.doc(key).set(data)
                }
        }

        async exec() {
                await this.send();
        }
}

new SeedKey().exec()
