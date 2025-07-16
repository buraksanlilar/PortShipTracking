using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Data;
using PortShipTracking.API.Repositories.ShipRepository;
using PortShipTracking.API.Services.ShipService;
using PortShipTracking.API.Repositories.CrewMemberRepository;
using PortShipTracking.API.Services.CrewMemberService;
using PortShipTracking.API.Repositories.PortRepository;
using PortShipTracking.API.Services.PortService;
using PortShipTracking.API.Repositories.ShipVisitRepository;
using PortShipTracking.API.Services.ShipVisitService;
using PortShipTracking.API.Repositories.CargoRepository;
using PortShipTracking.API.Services.CargoService;
using PortShipTracking.API.Repositories.ShipCrewAssignmentRepository;
using PortShipTracking.API.Services.ShipCrewAssignmentService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dependency Injection: Repository ve Service
builder.Services.AddScoped<IShipRepository, ShipRepository>();
builder.Services.AddScoped<IShipService, ShipService>();
builder.Services.AddScoped<IPortRepository, PortRepository>();
builder.Services.AddScoped<IPortService, PortService>();
builder.Services.AddScoped<ICrewMemberRepository, CrewMemberRepository>();
builder.Services.AddScoped<ICrewMemberService, CrewMemberService>();
builder.Services.AddScoped<IShipVisitRepository, ShipVisitRepository>();
builder.Services.AddScoped<IShipVisitService, ShipVisitService>();
builder.Services.AddScoped<ICargoRepository, CargoRepository>();
builder.Services.AddScoped<ICargoService, CargoService>();
builder.Services.AddScoped<IShipCrewAssignmentRepository, ShipCrewAssignmentRepository>();
builder.Services.AddScoped<IShipCrewAssignmentService, ShipCrewAssignmentService>();


var app = builder.Build();

// Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
