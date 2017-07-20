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

        public const int BufferSize = 4;

        public SocketHandler(ILogger<SocketHandler> logger)
        {
            _socks = new List<WebSocket>();
            _logger = logger;
        }

        public async Task Handle(WebSocket socket)
        {

            while (!socket.CloseStatus.HasValue)
            {
                var result = await Recieve(socket, CancellationToken.None);
                _logger.LogInformation($"Message: { Encoding.UTF8.GetString(result.Item1) }");
                await Send(socket, result.Item1, result.Item2.MessageType, CancellationToken.None);
            }
            await socket.CloseAsync(socket.CloseStatus.Value, socket.CloseStatusDescription, CancellationToken.None);
        }

        private async Task<(byte[], WebSocketReceiveResult)> Recieve(WebSocket socket, CancellationToken cancellationToken)
        {
            var inBytes = new List<byte>();
            var buffer = new byte[BufferSize];
            WebSocketReceiveResult result;
            do
            {
                result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                inBytes.AddRange(buffer.Take(result.Count));
            } while (!result.CloseStatus.HasValue && !result.EndOfMessage);
            return (inBytes.ToArray(), result);
        }

        private async Task Send(WebSocket socket, byte[] bytes, WebSocketMessageType messageType, CancellationToken cancellationToken)
        {
            for (var i = 0; i < bytes.Length; i += BufferSize)
            {
                await socket.SendAsync(new ArraySegment<byte>(bytes.Skip(i).Take(BufferSize).ToArray()), messageType, false, cancellationToken);
            }
            await socket.SendAsync(new ArraySegment<byte>(new byte[0]), messageType, true, cancellationToken);
        }
    }
}