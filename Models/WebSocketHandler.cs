using System.Collections.Generic;
using System.Net.WebSockets;

namespace WebsocketTestGame.Models
{
	public class WebSocketHandler
	{
		private List<WebSocket> sockets;

		public WebSocketHandler()
		{
			sockets = new List<WebSocket>();
		}

		public void Handle(WebSocket webSocket)
		{
			sockets.Add(webSocket);
		}
	}
}