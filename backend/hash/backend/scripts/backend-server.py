### !/usr/bin/env python3

import uvicorn 


import backend.hash.backend as backend

LISTEN_PORT=5000

async def main():
    app=uvicorn.app()


async.run(main())