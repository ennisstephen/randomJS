FROM loadimpact/k6:latest
COPY ./flask_tests.js /flask_tests.js
CMD ["run", "/flask_tests.js"]
