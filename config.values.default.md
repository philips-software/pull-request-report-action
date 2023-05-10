# Config Values for PR Report

## Details

To activate and deactivate the individual metrics, you need to configure them in
your workflow file. The following example shows how to do this:

```yaml
      - name: Generate PR report
        uses: philips-software/pull-request-report-action
        with:
          ShowNumberOfChangedFiles: 'no'
          ShowTimeToMergeAfterLastReview: 'no'
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

You only need to change the value from `yes` to `no` to deactivate the metric.
By default, all metrics are activated as you can see in the overview table.

## Overview
