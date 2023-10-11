import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export let options = {
    vus: 1,
    duration: '60s',
};

let postDuration = new Trend('post_duration');
let arrayOfResults = [];
let totalCount = 0;

export default function () {
    let res;
    
    // Test GET all apps
    res = http.get('http://my-service:5000/apps/all');
    check(res, {
        'status was 200': (r) => r.status == 200,
        'body is array': (r) => Array.isArray(JSON.parse(r.body)),
    });

    // Test GET app by id
    res = http.get('http://my-service:5000/apps/0');
    check(res, {
        'status was 200': (r) => r.status == 200,
        'body is array': (r) => Array.isArray(JSON.parse(r.body)),
    });

    // Test POST new app
    res = http.post('http://my-service:5000/apps', JSON.stringify(['Test App', 'App for testing', 1.00]), { headers: { 'Content-Type': 'application/json' } });
    check(res, {
        'status was 201': (r) => r.status == 201,
        'body is array': (r) => Array.isArray(JSON.parse(r.body)),
    });

    if (res.status === 201) {
        // Store response time for POST request in the array
        console.log(++totalCount);
        console.log(`Response time for POST request was ${res.timings.duration} ms`);
        arrayOfResults.push(Math.round(res.timings.duration));
        console.log("min time" + Math.min(...arrayOfResults));
        console.log("max time" + Math.max(...arrayOfResults));
        console.log("average time" + getAverage(arrayOfResults))
    }

    // Test DELETE app by id
    res = http.del('http://my-service:5000/apps/0');
    check(res, {
        'status was 200': (r) => r.status == 200,
    });
}

// Push the array of response times to the trend metric and log the results
export function handleSummary(data) {
    console.log("attempt 22")
}

function getAverage(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }
