CYAN='\033[0;36m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'
INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"
WARN_FLAG="[${ORANGE}WARN${RESET_COLOR}]"

GEN_TOKEN_CMD='dotenv -e .env -- node ./tools/js/genToken.js'

# Postgres seeds
PG_SEED_CMD='dotenv -e .env -- node ./tools/js/seedCondominiumMember.js'

# Firestore seeds
SEED_KEY_CMD='dotenv -e .env -- node ./tools/js/seedKey.js'
SEED_ROUTEMAP_CMD='dotenv -e .env -- node ./tools/js/seedRouteMap.js'


if [ ! -d "./dist" ]; then
    echo "${WARN_FLAG} /dist directory was not found! Building it."
    pnpm build
fi

echo "${INFO_FLAG} Running postgres seed"
pnpm $PG_SEED_CMD

echo "${INFO_FLAG} Running firestore seeds"
pnpm $SEED_KEY_CMD
pnpm $SEED_ROUTEMAP_CMD

echo "${INFO_FLAG} Building your JWT token"
pnpm $GEN_TOKEN_CMD
echo "${INFO_FLAG} Done. Use it on authorization header of this FaaS implementation!"
