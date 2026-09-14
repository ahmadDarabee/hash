import logging
import re

# patterns to be replaced
pattern = {
    "password": {
        "pattern": re.compile("^(.*?&password=)(.*?)([& ]?)$"),
        "replacement": "\\g<1>*******\\g<3>",
    }
}


class RedactFilter(logging.Filter):
    def filter(self, record):  # Add random values to the log record

        args = list(record.args)

        path = args[2]

        for k, v in pattern.items():
            p = v["pattern"]
            r = v["replacement"]
            path = p.sub(r, path)

        args[2] = path

        record.args = tuple(args)
        return record
