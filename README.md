# Repro of Time-Skipping Failure in Temporal

This branch contains a reproduction of a failure to perform time-skipping within tests using temporal's typescript-sdk. Related [issue in github](https://github.com/temporalio/sdk-java/issues/1565).

```
docker compose up -d
yarn
yarn jest
```

1) Is this the intended behavior?
2) If so, how should I fix the test?
3) If not is it fixable?

Thank you!