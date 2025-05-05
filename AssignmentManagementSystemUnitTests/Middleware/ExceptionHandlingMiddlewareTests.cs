using System.Net;
using System.Text.Json;
using API.Middleware;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

public class ExceptionHandlingMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenNoException_CallsNextMiddleware()
    {
        // Arrange
        var mockRequestDelegate = new Mock<RequestDelegate>();
        var middleware = new ExceptionHandlingMiddleware(mockRequestDelegate.Object);
        var context = new DefaultHttpContext();

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        mockRequestDelegate.Verify(next => next(context), Times.Once);
    }

    [Fact]
    public async Task InvokeAsync_WhenKeyNotFoundException_ReturnsNotFoundResponse()
    {
        // Arrange
        var mockRequestDelegate = new Mock<RequestDelegate>();
        mockRequestDelegate.Setup(next => next(It.IsAny<HttpContext>())).Throws(new KeyNotFoundException("Resource not found"));

        var middleware = new ExceptionHandlingMiddleware(mockRequestDelegate.Object);
        var context = new DefaultHttpContext();
        var responseStream = new MemoryStream();
        context.Response.Body = responseStream;

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal((int)HttpStatusCode.NotFound, context.Response.StatusCode);
        responseStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(responseStream).ReadToEndAsync();
        var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);
        Assert.Equal("Resource not found", responseJson.GetProperty("message").GetString());
    }

    [Fact]
    public async Task InvokeAsync_WhenInvalidOperationException_ReturnsBadRequestResponse()
    {
        // Arrange
        var mockRequestDelegate = new Mock<RequestDelegate>();
        mockRequestDelegate.Setup(next => next(It.IsAny<HttpContext>())).Throws(new InvalidOperationException("Invalid operation"));

        var middleware = new ExceptionHandlingMiddleware(mockRequestDelegate.Object);
        var context = new DefaultHttpContext();
        var responseStream = new MemoryStream();
        context.Response.Body = responseStream;

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal((int)HttpStatusCode.BadRequest, context.Response.StatusCode);
        responseStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(responseStream).ReadToEndAsync();
        var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);
        Assert.Equal("Invalid operation", responseJson.GetProperty("message").GetString());
    }

    [Fact]
    public async Task InvokeAsync_WhenGenericException_ReturnsInternalServerErrorResponse()
    {
        // Arrange
        var mockRequestDelegate = new Mock<RequestDelegate>();
        mockRequestDelegate.Setup(next => next(It.IsAny<HttpContext>())).Throws(new Exception("Unexpected error"));

        var middleware = new ExceptionHandlingMiddleware(mockRequestDelegate.Object);
        var context = new DefaultHttpContext();
        var responseStream = new MemoryStream();
        context.Response.Body = responseStream;

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal((int)HttpStatusCode.InternalServerError, context.Response.StatusCode);
        responseStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(responseStream).ReadToEndAsync();
        var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);
        Assert.Equal("Unexpected error", responseJson.GetProperty("message").GetString());
    }
}