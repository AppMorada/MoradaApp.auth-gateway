class SeedKey {
        signatures = {
                ACCESS_TOKEN_KEY: 900 * 1000,
        };

        async send() {
                const createKeyFuncURL = String(process.env.CREATE_KEY_FUNC_URL);
                console.log('Inserting the following keys:');

                for (const key in this.signatures) {
                        const body = JSON.stringify({
                                name: key,
                                ttl: this.signatures[key],
                        });

                        console.log(body);

                        await fetch(createKeyFuncURL, {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                                body,
                        });
                }
        }

        async exec() {
                await this.send();
        }
}

new SeedKey().exec()
