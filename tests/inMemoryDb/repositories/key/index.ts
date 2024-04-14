import { Key } from "@functions/authGatewayFnc/app/entities/key";
import { KeyRepo, KeysEnum } from "@functions/authGatewayFnc/app/repositories/keyRepo.abstract";
import { globalConstants } from "@functions/constants";
import { InMemoryErrorDatabase } from "../../error";

/** Dedicated mock of FirestoreKey */
export class InMemoryKeyRepo implements KeyRepo {
  calls = {
    getSignature: 0
  }

  async getSignature(name: KeysEnum): Promise<Key> {
      ++this.calls.getSignature

      const key = globalConstants.KEYS.find((item) => (
        item.name === name.toString()
      ))

      if(!key)
        throw new InMemoryErrorDatabase(`A chave com o nome "${name.toString()}" não foi encontrada`)
   
      return key
  }
}
