INFO_FLAG="[INFO]" 

echo "${INFO_FLAG} Install pnpm"
npm install pnpm -g

echo "${INFO_FLAG} Installing dependencies"
pnpm install

echo "${INFO_FLAG} Building project"
pnpm run build
