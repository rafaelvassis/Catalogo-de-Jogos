# ---- Build: restaura, compila e publica a API ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia só o .csproj primeiro: o restore fica em cache enquanto as
# dependências não mudarem.
COPY backend.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app/publish --no-restore

# ---- Runtime: imagem enxuta, só com o necessário para rodar ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

# As imagens do .NET escutam na porta 8080 por padrão (porta sem privilégio).
# Na Vercel, defina PORT=8080 nas variáveis do projeto (o padrão dela é 80).
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# Roda sem root: a imagem traz o usuário "app", mas só o usa se pedirmos.
USER $APP_UID

ENTRYPOINT ["dotnet", "backend.dll"]
