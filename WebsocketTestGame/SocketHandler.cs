using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace WebsocketTestGame
{
    public class SocketHandler
    {
        private List<WebSocket> _socks;

        private ILogger<SocketHandler> _logger;

        public SocketHandler(ILogger<SocketHandler> logger)
        {
            _socks = new List<WebSocket>();
            _logger = logger;
        }

        public async Task Handle(HttpContext context, WebSocket sock)
        {
            var buffer = new byte[1024 * 4];
            var result = await sock.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue)
            {
                await sock.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);

                _logger.LogInformation($"New Message: { Encoding.UTF8.GetString(buffer) }");

                result = await sock.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            await sock.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
}
