async function my_asyncFunction() {
  console.log("NOT SLEEP");
  await sleep(30000);
  console.log("SLEEP COMPLETED");
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

my_asyncFunction();
