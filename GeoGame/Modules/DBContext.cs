using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class GeoGameDbContext : DbContext
    {
        public GeoGameDbContext(DbContextOptions<GeoGameDbContext> options) : base(options)
        {
        }

        public GeoGameDbContext() : base()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var skipNavigation in entityType.GetSkipNavigations())
                {
                    Debug.WriteLine(entityType.DisplayName() + "." + skipNavigation.Name);
                }
            }

            modelBuilder.Entity<QuestionAnswer>()
           .HasKey(t => new { t.QuestionId, t.AnswerId });

            modelBuilder.Entity<QuestionAnswer>()
                .HasOne(pt => pt.Question)
                .WithMany(p => p.QuestionAnswers)
                .HasForeignKey(pt => pt.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuestionAnswer>()
                .HasOne(pt => pt.Answer)
                .WithMany(t => t.QuestionAnswers)
                .HasForeignKey(pt => pt.AnswerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuestionLocalizations>()
                .HasKey(t => new { t.QuestionId, t.LocationId });

            modelBuilder.Entity<QuestionLocalizations>()
                .HasOne(pt => pt.Question)
                .WithMany(p => p.QuestionLocalizations)
                .HasForeignKey(pt => pt.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuestionLocalizations>()
                .HasOne(pt => pt.Location)
                .WithMany(t => t.QuestionLocalizations)
                .HasForeignKey(pt => pt.LocationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Questions>()
               .HasMany(a => a.Locations)
               .WithMany(q => q.Questions)
               .UsingEntity<QuestionLocalizations>(
                   q => q
                   .HasOne(q => q.Location)
                   .WithMany(qa => qa.QuestionLocalizations)
                   .HasForeignKey(a => a.LocationId),
                    q => q
                   .HasOne(q => q.Question)
                   .WithMany(qa => qa.QuestionLocalizations)
                   .HasForeignKey(a => a.QuestionId)
               );

            modelBuilder.Entity<Questions>()
                .HasMany(a => a.Answers)
                .WithMany(q => q.Questions)
                .UsingEntity<QuestionAnswer>(
                    q => q
                    .HasOne(q => q.Answer)
                    .WithMany(qa => qa.QuestionAnswers)
                    .HasForeignKey(a => a.AnswerId),
                     q => q
                    .HasOne(q => q.Question)
                    .WithMany(qa => qa.QuestionAnswers)
                    .HasForeignKey(a => a.QuestionId)
                );

            base.OnModelCreating(modelBuilder);


        }

        public DbSet<Questions> Questions { get; set; }
        public DbSet<Answers> Answers { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<QuestionAnswer> QuestionAnswers { get; set; }
        public DbSet<QuestionLocalizations> QuestionLocalizations { get; set; }

    }
}

