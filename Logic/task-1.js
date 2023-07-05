function solution(a, m, k) {
    let count = 0;
    for (let i = 0; i < a.length - m + 1; i++) {
      const subarray = a.slice(i, i + m);
      let pairFound = false;
      for (let j = 0; j < subarray.length; j++) {
        for (let l = j + 1; l < subarray.length; l++) {
          if (subarray[j] + subarray[l] === k) {
            pairFound = true;
            break;
          }
        }
        if (pairFound) {
          break;
        }
      }
      if (pairFound) {
        count++;
      }
    }
    return count;
  }
  

const a = [15, 8, 8, 2, 6, 4, 1, 7];
const m = 2;
const k = 8;
const result = solution(a, m, k);
console.log(result)
