// Deployment script
async function main() {
  console.log("Deploying contracts...");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
