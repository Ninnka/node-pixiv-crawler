const createP = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
}

let arr = [1, 2, 3];

async function func () {
  for (let i = 0; i < arr.length; i++) {
    console.log(i);
    await createP();
  }
}

func()
