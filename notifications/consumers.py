import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Each user has a unique notification group
        self.group_name = f"notifications_{self.scope['user'].id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    # ვაგზავნით მესიჯს იუზერთან
    async def send_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps(notification))