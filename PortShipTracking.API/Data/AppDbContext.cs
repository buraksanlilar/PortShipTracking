using Microsoft.EntityFrameworkCore;
using PortShipTracking.API.Models;

namespace PortShipTracking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Ship> Ships => Set<Ship>();
    public DbSet<Port> Ports => Set<Port>();
    public DbSet<CrewMember> CrewMembers => Set<CrewMember>();
    public DbSet<Cargo> Cargos => Set<Cargo>();
    public DbSet<ShipVisit> ShipVisits => Set<ShipVisit>();
    public DbSet<ShipCrewAssignment> ShipCrewAssignments => Set<ShipCrewAssignment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tablo isimlerini açık şekilde tanımlıyoruz
        modelBuilder.Entity<Ship>().ToTable("Ships");
        modelBuilder.Entity<Port>().ToTable("Ports");
        modelBuilder.Entity<CrewMember>().ToTable("CrewMembers");
        modelBuilder.Entity<Cargo>().ToTable("Cargos");
        modelBuilder.Entity<ShipVisit>().ToTable("ShipVisits");
        modelBuilder.Entity<ShipCrewAssignment>().ToTable("ShipCrewAssignments");

        // ShipCrewAssignment: Aynı kişi aynı gemiye birden fazla atanamasın
        modelBuilder.Entity<ShipCrewAssignment>()
            .HasIndex(a => new { a.ShipId, a.CrewId })
            .IsUnique();
    }
}
