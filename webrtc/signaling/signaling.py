#!/usr/bin/env python
# -*- coding: utf-8 -*-

import asyncio
import websockets


class Server:
    def __init__(self, host='localhost', port=8001):
        self.offer_sdp = asyncio.Queue()
        self.answer_sdp = asyncio.Queue()
        self.server = host, port

    async def offer(self, ws):
        # recv offer
        sdp = await ws.recv()
        self.offer_sdp.put_nowait(sdp)
        print('> Got offer SDP')

        # send answer
        sdp = await self.answer_sdp.get()
        await ws.send(sdp)

    async def answer(self, ws):
        # send offer
        sdp = self.offer_sdp.get_nowait()
        await ws.send(sdp)

        # recv answer
        sdp = await ws.recv()
        self.answer_sdp.put_nowait(sdp)
        print('> Got answer SDP')

    async def handler(self, ws, path):
        if self.offer_sdp.empty():
            print('Offer is empty')
            await self.offer(ws)
        else:
            print('Offer is set')
            await self.answer(ws)

    def run(self):
        host, port = self.server
        runner = websockets.serve(self.handler, host, port)
        asyncio.get_event_loop().run_until_complete(runner)
        asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    server = Server()
    server.run()
