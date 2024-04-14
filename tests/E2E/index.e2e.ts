import { authGatewayFnc } from "@functions/index"
import { createServer } from "http"
import request from "supertest"
import { JsonwebtokenAdapter } from "@functions/authGatewayFnc/app/adapters/jsonwebtoken"
import { Adapters } from "@functions/authGatewayFnc/app/adapters"
import { TraceHandler } from "@functions/authGatewayFnc/infra/configs/tracing"
import { FirestoreService } from "@functions/authGatewayFnc/infra/storage/firestore"
import { FirestoreKey } from "@functions/authGatewayFnc/infra/storage/firestore/repositories/keyRepo"
import { KeysEnum } from "@functions/authGatewayFnc/app/repositories/keyRepo.abstract"
import express from "express"

describe('Auth gateway E2E test', () => {
	let app: ReturnType<typeof createServer>
    let token: string | undefined

	beforeEach(async () => {
        const server = express()
        app = createServer(server)
        server.get('*', authGatewayFnc)

		const jwtAdapter = new JsonwebtokenAdapter()

		const adapters = new Adapters()
		const tracer = new TraceHandler()
        const firestoreService = new FirestoreService()
        const firestoreKey = new FirestoreKey(
          firestoreService, adapters,
          tracer
        )

        const key = await firestoreKey.getSignature(KeysEnum.ACCESS_TOKEN_KEY)
        token = jwtAdapter.build(
          { sub: '1465520e-f8be-445c-a8e6-34f708afc513' },
          key.actual.content,
          new Date(Date.now() + 1000 * 60 * 60 * 24)
        )
    })

	afterEach(async () => {
      app.close()
    })

	it('should be able to authenticate', async () => {
        await request(app)
          .get('/registryapi')
          .set('authorization', `Bearer ${token}`)
          .expect(200)
	})

	it('should throw one error - unauthorized', async () => {
		await request(app)
	      .get('/registryapi')
	      .set('authorization', `Bearer wrong token`)
          .expect(401)
	})

    it('should throw one error - unauthorized', async () => {
		await request(app)
	      .get('/not-found-route')
	      .set('authorization', `Bearer ${token}`)
          .expect(404)
	})
})
