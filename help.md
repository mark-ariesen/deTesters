## INSTALL EVERYTHING ##
npm ci

## GETTING STARTED ##
1. Run cypress in open mode:
npx cypress open

2. Run cypress (as-if part of) CI
npx cypress run 

3. Run only GOLD cypress tests (GOLD > SILVER > BRONZE)
npx cypress run --env grepTags=GOLD,grepFilterSpecs=true

