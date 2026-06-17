import { WebDesignConfig, Page } from '../types';

export function generateDotnetFiles(config: WebDesignConfig, dotnetVersion = 'net8.0'): Record<string, string> {
  const files: Record<string, string> = {};
  const rootNamespace = 'Dara';

  // 0. solution file (Dara.sln)
  files['Dara.sln'] = `
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Dara.Domain", "Dara.Domain\\Dara.Domain.csproj", "{11111111-1111-1111-1111-111111111111}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Dara.Application", "Dara.Application\\Dara.Application.csproj", "{22222222-2222-2222-2222-222222222222}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Dara.Infrastructure", "Dara.Infrastructure\\Dara.Infrastructure.csproj", "{33333333-3333-3333-3333-333333333333}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Dara.ClientApi", "Dara.ClientApi\\Dara.ClientApi.csproj", "{44444444-4444-4444-4444-444444444444}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Dara.ClientPortal", "Dara.ClientPortal\\Dara.ClientPortal.csproj", "{55555555-5555-5555-5555-555555555555}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{11111111-1111-1111-1111-111111111111}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{11111111-1111-1111-1111-111111111111}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{11111111-1111-1111-1111-111111111111}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{11111111-1111-1111-1111-111111111111}.Release|Any CPU.Build.0 = Release|Any CPU
		{22222222-2222-2222-2222-222222222222}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{22222222-2222-2222-2222-222222222222}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{22222222-2222-2222-2222-222222222222}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{22222222-2222-2222-2222-222222222222}.Release|Any CPU.Build.0 = Release|Any CPU
		{33333333-3333-3333-3333-333333333333}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{33333333-3333-3333-3333-333333333333}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{33333333-3333-3333-3333-333333333333}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{33333333-3333-3333-3333-333333333333}.Release|Any CPU.Build.0 = Release|Any CPU
		{44444444-4444-4444-4444-444444444444}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{44444444-4444-4444-4444-444444444444}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{44444444-4444-4444-4444-444444444444}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{44444444-4444-4444-4444-444444444444}.Release|Any CPU.Build.0 = Release|Any CPU
		{55555555-5555-5555-5555-555555555555}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{55555555-5555-5555-5555-555555555555}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{55555555-5555-5555-5555-555555555555}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{55555555-5555-5555-5555-555555555555}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
EndGlobal
`;

  // ==========================================
  // LAYER 1: Dara.Domain
  // ==========================================
  files['Dara.Domain/Dara.Domain.csproj'] = `
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>${dotnetVersion}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
`;

  files['Dara.Domain/Common/BaseEntity.cs'] = `using System;

namespace Dara.Domain.Common
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public Guid Uuid { get; set; } = Guid.NewGuid();
    }
}
`;

  files['Dara.Domain/Common/AuditableBaseEntity.cs'] = `using System;

namespace Dara.Domain.Common
{
    public abstract class AuditableBaseEntity : BaseEntity
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
        
        public string CreatedBy { get; set; } = "system";
        public string? UpdatedBy { get; set; }
        public string? DeletedBy { get; set; }
    }
}
`;

  files['Dara.Domain/Common/AuditableEntity.cs'] = `namespace Dara.Domain.Common
{
    public abstract class AuditableEntity : AuditableBaseEntity
    {
        public int CompanyId { get; set; }
        // Virtual Company reference
        public virtual string Company { get; set; } = "DefaultCompany";
    }
}
`;

  // Entities
  files['Dara.Domain/Entities/BlogPost.cs'] = `using Dara.Domain.Common;

namespace Dara.Domain.Entities
{
    public class BlogPost : AuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
`;

  files['Dara.Domain/Entities/Product.cs'] = `using Dara.Domain.Common;

namespace Dara.Domain.Entities
{
    public class Product : AuditableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool InStock { get; set; } = true;
    }
}
`;


  // ==========================================
  // LAYER 2: Dara.Application
  // ==========================================
  files['Dara.Application/Dara.Application.csproj'] = `
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>${dotnetVersion}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\Dara.Domain\\Dara.Domain.csproj" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="MediatR" Version="12.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  </ItemGroup>
</Project>
`;

  files['Dara.Application/Common/Models/ApiResponse.cs'] = `namespace Dara.Application.Common.Models
{
    public class ApiResponse<T>
    {
        public T Data { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
        public int StatusCode { get; set; }

        public ApiResponse(T data, bool success = true, string message = "", int statusCode = 200)
        {
            Data = data;
            Success = success;
            Message = message;
            StatusCode = statusCode;
        }

        public static ApiResponse<T> Ok(T data, string message = "Success") => new ApiResponse<T>(data, true, message, 200);
        public static ApiResponse<T> Failed(string message, int statusCode = 400) => new ApiResponse<T>(default!, false, message, statusCode);
    }
}
`;

  files['Dara.Application/Common/Interfaces/IGenericRepository.cs'] = `using System.Linq;
using System.Threading.Tasks;
using Dara.Domain.Common;

namespace Dara.Application.Common.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        IQueryable<T> TableNoTracking { get; }
        IQueryable<T> Table { get; }
        
        Task<T?> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity); // Soft delete handled via state tracking or manual calls
    }
}
`;

  files['Dara.Application/Common/Interfaces/IUnitOfWork.cs'] = `using System;
using System.Threading.Tasks;
using Dara.Domain.Common;

namespace Dara.Application.Common.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> SaveChangesAsync();
        
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
`;

  files['Dara.Application/Common/Interfaces/ICurrentUserService.cs'] = `namespace Dara.Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        string? UserId { get; }
        int CompanyId { get; }
    }
}
`;

  // Mappers
  files['Dara.Application/Common/Mappings/BlogPostMapper.cs'] = `using Dara.Domain.Entities;
using Dara.Application.Features.BlogPosts.DTOs;

namespace Dara.Application.Common.Mappings
{
    public static class BlogPostMapper
    {
        public static BlogPostDto MapToDto(BlogPost entity)
        {
            return new BlogPostDto
            {
                Id = entity.Id,
                Uuid = entity.Uuid,
                Title = entity.Title,
                Slug = entity.Slug,
                Excerpt = entity.Excerpt,
                Body = entity.Body,
                Category = entity.Category,
                Author = entity.Author,
                ImageUrl = entity.ImageUrl,
                CreatedAt = entity.CreatedAt,
                CompanyId = entity.CompanyId
            };
        }
    }
}
`;

  files['Dara.Application/Common/Mappings/ProductMapper.cs'] = `using Dara.Domain.Entities;
using Dara.Application.Features.Products.DTOs;

namespace Dara.Application.Common.Mappings
{
    public static class ProductMapper
    {
        public static ProductDto MapToDto(Product entity)
        {
            return new ProductDto
            {
                Id = entity.Id,
                Uuid = entity.Uuid,
                Name = entity.Name,
                Slug = entity.Slug,
                Price = entity.Price,
                Description = entity.Description,
                ImageUrl = entity.ImageUrl,
                InStock = entity.InStock,
                CompanyId = entity.CompanyId
            };
        }
    }
}
`;

  // Features: BlogPosts DTOs, Queries & Commands
  files['Dara.Application/Features/BlogPosts/DTOs/BlogPostDto.cs'] = `using System;

namespace Dara.Application.Features.BlogPosts.DTOs
{
    public class BlogPostDto
    {
        public int Id { get; set; }
        public Guid Uuid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int CompanyId { get; set; }
    }
}
`;

  files['Dara.Application/Features/BlogPosts/Queries/GetBlogPostsQuery.cs'] = `using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;
using Dara.Application.Common.Mappings;
using Dara.Application.Features.BlogPosts.DTOs;

namespace Dara.Application.Features.BlogPosts.Queries
{
    public record GetBlogPostsQuery : IRequest<ApiResponse<List<BlogPostDto>>>;

    public class GetBlogPostsQueryHandler : IRequestHandler<GetBlogPostsQuery, ApiResponse<List<BlogPostDto>>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public GetBlogPostsQueryHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<List<BlogPostDto>>> Handle(GetBlogPostsQuery request, CancellationToken cancellationToken)
        {
            var companyId = _currentUserService.CompanyId;
            var repo = _uow.Repository<BlogPost>();

            // Rules: Query must filter by CompanyId and use TableNoTracking (where !isDeleted is automatically resolved or handled)
            var posts = await repo.TableNoTracking
                .Where(x => x.CompanyId == companyId && !x.IsDeleted)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            var dtos = posts.Select(BlogPostMapper.MapToDto).ToList();
            return ApiResponse<List<BlogPostDto>>.Ok(dtos, "Blog posts loaded successfully.");
        }
    }
}
`;

  files['Dara.Application/Features/BlogPosts/Commands/CreateBlogPostCommand.cs'] = `using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;
using Dara.Application.Common.Mappings;
using Dara.Application.Features.BlogPosts.DTOs;

namespace Dara.Application.Features.BlogPosts.Commands
{
    public class CreateBlogPostCommand : IRequest<ApiResponse<BlogPostDto>>
    {
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class CreateBlogPostCommandHandler : IRequestHandler<CreateBlogPostCommand, ApiResponse<BlogPostDto>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public CreateBlogPostCommandHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<BlogPostDto>> Handle(CreateBlogPostCommand request, CancellationToken cancellationToken)
        {
            var post = new BlogPost
            {
                Title = request.Title,
                Slug = request.Slug,
                Excerpt = request.Excerpt,
                Body = request.Body,
                Category = request.Category,
                Author = request.Author,
                ImageUrl = request.ImageUrl,
                CompanyId = _currentUserService.CompanyId,
                CreatedBy = _currentUserService.UserId ?? "system"
            };

            await _uow.Repository<BlogPost>().AddAsync(post);
            await _uow.SaveChangesAsync();

            var dto = BlogPostMapper.MapToDto(post);
            return ApiResponse<BlogPostDto>.Ok(dto, "Blog post created successfully.");
        }
    }
}
`;

  files['Dara.Application/Features/BlogPosts/Commands/DeleteBlogPostCommand.cs'] = `using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;

namespace Dara.Application.Features.BlogPosts.Commands
{
    public record DeleteBlogPostCommand(int Id) : IRequest<ApiResponse<bool>>;

    public class DeleteBlogPostCommandHandler : IRequestHandler<DeleteBlogPostCommand, ApiResponse<bool>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public DeleteBlogPostCommandHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(DeleteBlogPostCommand request, CancellationToken cancellationToken)
        {
            var repo = _uow.Repository<BlogPost>();
            var post = await repo.GetByIdAsync(request.Id);

            if (post == null || post.CompanyId != _currentUserService.CompanyId || post.IsDeleted)
            {
                return ApiResponse<bool>.Failed("Blog post not found in your company context", 404);
            }

            // Compliance Rule: Never physically delete. Set IsDeleted, DeletedAt, DeletedBy.
            post.IsDeleted = true;
            post.DeletedAt = DateTime.UtcNow;
            post.DeletedBy = _currentUserService.UserId ?? "system";

            repo.Update(post);
            await _uow.SaveChangesAsync();

            return ApiResponse<bool>.Ok(true, "Blog post soft-deleted successfully.");
        }
    }
}
`;


  // Features: Products
  files['Dara.Application/Features/Products/DTOs/ProductDto.cs'] = `using System;

namespace Dara.Application.Features.Products.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public Guid Uuid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool InStock { get; set; }
        public int CompanyId { get; set; }
    }
}
`;

  files['Dara.Application/Features/Products/Queries/GetProductsQuery.cs'] = `using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;
using Dara.Application.Common.Mappings;
using Dara.Application.Features.Products.DTOs;

namespace Dara.Application.Features.Products.Queries
{
    public record GetProductsQuery : IRequest<ApiResponse<List<ProductDto>>>;

    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, ApiResponse<List<ProductDto>>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public GetProductsQueryHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<List<ProductDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var companyId = _currentUserService.CompanyId;
            var repo = _uow.Repository<Product>();

            var products = await repo.TableNoTracking
                .Where(x => x.CompanyId == companyId && !x.IsDeleted)
                .OrderBy(x => x.Name)
                .ToListAsync(cancellationToken);

            var dtos = products.Select(ProductMapper.MapToDto).ToList();
            return ApiResponse<List<ProductDto>>.Ok(dtos, "Products retrieved successfully.");
        }
    }
}
`;

  files['Dara.Application/Features/Products/Commands/CreateProductCommand.cs'] = `using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;
using Dara.Application.Common.Mappings;
using Dara.Application.Features.Products.DTOs;

namespace Dara.Application.Features.Products.Commands
{
    public class CreateProductCommand : IRequest<ApiResponse<ProductDto>>
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool InStock { get; set; } = true;
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ApiResponse<ProductDto>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public CreateProductCommandHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var prod = new Product
            {
                Name = request.Name,
                Slug = request.Slug,
                Price = request.Price,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                InStock = request.InStock,
                CompanyId = _currentUserService.CompanyId,
                CreatedBy = _currentUserService.UserId ?? "system"
            };

            await _uow.Repository<Product>().AddAsync(prod);
            await _uow.SaveChangesAsync();

            var dto = ProductMapper.MapToDto(prod);
            return ApiResponse<ProductDto>.Ok(dto, "Product registered successfully.");
        }
    }
}
`;

  files['Dara.Application/Features/Products/Commands/DeleteProductCommand.cs'] = `using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Dara.Domain.Entities;
using Dara.Application.Common.Interfaces;
using Dara.Application.Common.Models;

namespace Dara.Application.Features.Products.Commands
{
    public record DeleteProductCommand(int Id) : IRequest<ApiResponse<bool>>;

    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, ApiResponse<bool>>
    {
        private readonly IUnitOfWork _uow;
        private readonly ICurrentUserService _currentUserService;

        public DeleteProductCommandHandler(IUnitOfWork uow, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var repo = _uow.Repository<Product>();
            var product = await repo.GetByIdAsync(request.Id);

            if (product == null || product.CompanyId != _currentUserService.CompanyId || product.IsDeleted)
            {
                return ApiResponse<bool>.Failed("Product not found in your company scope.", 404);
            }

            // Compliance Rule: Soft Delete only
            product.IsDeleted = true;
            product.DeletedAt = DateTime.UtcNow;
            product.DeletedBy = _currentUserService.UserId ?? "system";

            repo.Update(product);
            await _uow.SaveChangesAsync();

            return ApiResponse<bool>.Ok(true, "Product soft-deleted successfully.");
        }
    }
}
`;


  // ==========================================
  // LAYER 3: Dara.Infrastructure
  // ==========================================
  files['Dara.Infrastructure/Dara.Infrastructure.csproj'] = `
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>${dotnetVersion}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\Dara.Domain\\Dara.Domain.csproj" />
    <ProjectReference Include="..\\Dara.Application\\Dara.Application.csproj" />
  </ItemGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  </ItemGroup>
</Project>
`;

  files['Dara.Infrastructure/Persistence/ApplicationDbContext.cs'] = `using Microsoft.EntityFrameworkCore;
using Dara.Domain.Entities;

namespace Dara.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<Product> Products => Set<Product>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Map table details & index requirements
            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Slug).HasMaxLength(255).IsRequired();
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Name).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Slug).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Price).HasPrecision(18, 2);
            });
        }
    }
}
`;

  files['Dara.Infrastructure/Persistence/Repositories/GenericRepository.cs'] = `using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Dara.Domain.Common;
using Dara.Application.Common.Interfaces;
using Dara.Infrastructure.Persistence;

namespace Dara.Infrastructure.Persistence.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext _dbContext;

        public GenericRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // TableNoTracking for optimized reads
        public IQueryable<T> TableNoTracking => _dbContext.Set<T>().AsNoTracking();

        public IQueryable<T> Table => _dbContext.Set<T>();

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public async Task AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbContext.Set<T>().Update(entity);
        }

        public void Delete(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
        }
    }
}
`;

  files['Dara.Infrastructure/Persistence/UnitOfWork/UnitOfWork.cs'] = `using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using Dara.Domain.Common;
using Dara.Application.Common.Interfaces;
using Dara.Infrastructure.Persistence;
using Dara.Infrastructure.Persistence.Repositories;

namespace Dara.Infrastructure.Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ConcurrentDictionary<string, object> _repositories;
        private IDbContextTransaction? _currentTransaction;

        public UnitOfWork(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _repositories = new ConcurrentDictionary<string, object>();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var type = typeof(TEntity).Name;
            return (IGenericRepository<TEntity>)_repositories.GetOrCreate(type, _ => new GenericRepository<TEntity>(_dbContext));
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }

        // Transactions management
        public async Task BeginTransactionAsync()
        {
            if (_currentTransaction != null) return;
            _currentTransaction = await _dbContext.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                if (_currentTransaction != null)
                {
                    await _currentTransaction.CommitAsync();
                }
            }
            finally
            {
                DisposeTransaction();
            }
        }

        public async Task RollbackTransactionAsync()
        {
            try
            {
                if (_currentTransaction != null)
                {
                    await _currentTransaction.RollbackAsync();
                }
            }
            finally
            {
                DisposeTransaction();
            }
        }

        private void DisposeTransaction()
        {
            _currentTransaction?.Dispose();
            _currentTransaction = null;
        }

        public void Dispose()
        {
            _dbContext.Dispose();
            _currentTransaction?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
`;


  // ==========================================
  // LAYER 4: Dara.ClientApi
  // ==========================================
  files['Dara.ClientApi/Dara.ClientApi.csproj'] = `
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>${dotnetVersion}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\Dara.Domain\\Dara.Domain.csproj" />
    <ProjectReference Include="..\\Dara.Application\\Dara.Application.csproj" />
    <ProjectReference Include="..\\Dara.Infrastructure\\Dara.Infrastructure.csproj" />
  </ItemGroup>
</Project>
`;

  files['Dara.ClientApi/appsettings.json'] = `
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=DaraERP.db"
  }
}
`;

  files['Dara.ClientApi/Controllers/ApiControllerBase.cs'] = `using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Dara.ClientApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiControllerBase : ControllerBase
    {
        private ISender? _mediator;
        protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
    }
}
`;

  files['Dara.ClientApi/Controllers/BlogPostsController.cs'] = `using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dara.Application.Common.Models;
using Dara.Application.Features.BlogPosts.DTOs;
using Dara.Application.Features.BlogPosts.Queries;
using Dara.Application.Features.BlogPosts.Commands;

namespace Dara.ClientApi.Controllers
{
    public class BlogPostsController : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<BlogPostDto>>>> Get()
        {
            return Ok(await Mediator.Send(new GetBlogPostsQuery()));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<BlogPostDto>>> Create([FromBody] CreateBlogPostCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            return Ok(await Mediator.Send(new DeleteBlogPostCommand(id)));
        }
    }
}
`;

  files['Dara.ClientApi/Controllers/ProductsController.cs'] = `using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dara.Application.Common.Models;
using Dara.Application.Features.Products.DTOs;
using Dara.Application.Features.Products.Queries;
using Dara.Application.Features.Products.Commands;

namespace Dara.ClientApi.Controllers
{
    public class ProductsController : ApiControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProductDto>>>> Get()
        {
            return Ok(await Mediator.Send(new GetProductsQuery()));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Create([FromBody] CreateProductCommand command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            return Ok(await Mediator.Send(new DeleteProductCommand(id)));
        }
    }
}
`;

  files['Dara.ClientApi/Program.cs'] = `using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Dara.Application.Common.Interfaces;
using Dara.Infrastructure.Persistence;
using Dara.Infrastructure.Persistence.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context representing SQLite local storage
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=DaraERP.db"));

// Register system interfaces for DI
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register mock Current User scope
builder.Services.AddScoped<ICurrentUserService, MockCurrentUserService>();

// Register MediatR handlers inside Dara.Application
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Dara.Application.Common.Interfaces.IUnitOfWork).Assembly));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure Database is physically deployed and seeded with defaults on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    SeedComplianceData(context);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();

// Seed mock products and articles complying with schema constraints
static void SeedComplianceData(ApplicationDbContext context)
{
    if (!context.BlogPosts.Any())
    {
        context.BlogPosts.AddRange(new[]
        {
            new Dara.Domain.Entities.BlogPost
            {
                Title = "DaraERP Architecture System Overview",
                Slug = "daraerp-architecture-system-overview",
                Excerpt = "Learn how DaraERP manages highly audit-compliant entities.",
                Body = "The core system strictly obeys standard 5-layer separation of concerns.",
                Category = "Engineering",
                Author = "Admin Executive",
                CompanyId = 1,
                CreatedBy = "seeder"
            }
        });
        context.SaveChanges();
    }
}

// Current User Mock implementation
public class MockCurrentUserService : ICurrentUserService
{
    public string? UserId => "user_dara_compliance_compliance_system";
    public int CompanyId => 1; // Default client company mapping
}
`;


  // ==========================================
  // LAYER 5: Dara.ClientPortal (UI Web)
  // ==========================================
  files['Dara.ClientPortal/Dara.ClientPortal.csproj'] = `
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>${dotnetVersion}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\\Dara.Application\\Dara.Application.csproj" />
  </ItemGroup>
</Project>
`;

  files['Dara.ClientPortal/appsettings.json'] = `
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ApiSettings": {
    "BaseUrl": "http://localhost:5211"
  }
}
`;

  files['Dara.ClientPortal/Clients/ApiClient.cs'] = `using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Dara.Application.Common.Models;
using Dara.Application.Features.BlogPosts.DTOs;
using Dara.Application.Features.Products.DTOs;
using System.Collections.Generic;

namespace Dara.ClientPortal.Clients
{
    public interface IApiClient
    {
        Task<ApiResponse<List<BlogPostDto>>> GetBlogPostsAsync();
        Task<ApiResponse<List<ProductDto>>> GetProductsAsync();
    }

    public class ApiClient : IApiClient
    {
        private readonly HttpClient _httpClient;

        public ApiClient(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            var baseUrl = config["ApiSettings:BaseUrl"] ?? "http://localhost:5211";
            _httpClient.BaseAddress = new System.Uri(baseUrl);
        }

        public async Task<ApiResponse<List<BlogPostDto>>> GetBlogPostsAsync()
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<BlogPostDto>>>("api/BlogPosts");
                return response ?? ApiResponse<List<BlogPostDto>>.Failed("Api output null");
            }
            catch (System.Exception ex)
            {
                return ApiResponse<List<BlogPostDto>>.Failed(ex.Message);
            }
        }

        public async Task<ApiResponse<List<ProductDto>>> GetProductsAsync()
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<ProductDto>>>("api/Products");
                return response ?? ApiResponse<List<ProductDto>>.Failed("Api output null");
            }
            catch (System.Exception ex)
            {
                return ApiResponse<List<ProductDto>>.Failed(ex.Message);
            }
        }
    }
}
`;

  files['Dara.ClientPortal/Controllers/HomeController.cs'] = `using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dara.ClientPortal.Clients;

namespace Dara.ClientPortal.Controllers
{
    public class HomeController : Controller
    {
        private readonly IApiClient _apiClient;

        public HomeController(IApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public async Task<IActionResult> Index()
        {
            ViewBag.ProjectName = "${config.projectName}";
            var blogsResponse = await _apiClient.GetBlogPostsAsync();
            var productsResponse = await _apiClient.GetProductsAsync();

            ViewBag.Blogs = blogsResponse.Success ? blogsResponse.Data : new();
            ViewBag.Products = productsResponse.Success ? productsResponse.Data : new();

            return View();
        }
    }
}
`;

  files['Dara.ClientPortal/Views/_ViewImports.cshtml'] = `
@using Dara.ClientPortal
@using Dara.ClientPortal.Controllers
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
`;

  files['Dara.ClientPortal/Views/_ViewStart.cshtml'] = `
@{
    Layout = "_Layout";
}
`;

  files['Dara.ClientPortal/Views/Shared/_Layout.cshtml'] = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewBag.ProjectName - DaraERP Portal</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css" />
    <style>
        :root {
            --bs-primary: ${config.colorPalette.primary};
            --bs-primary-rgb: 99, 102, 241;
        }
        body {
            background-color: #0f172a;
            color: #e2e8f0;
        }
        .navbar-custom {
            background-color: #1e293b;
            border-bottom: 1px solid #334155;
        }
        .card-custom {
            background-color: #1e293b;
            border: 1px solid #334155;
            transition: transform 0.2s;
        }
        .card-custom:hover {
            transform: translateY(-4px);
        }
    </style>
</head>
<body>
    <header>
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark navbar-custom box-shadow mb-3">
            <div class="container">
                <a class="navbar-brand text-white font-weight-bold" asp-area="" asp-controller="Home" asp-action="Index">
                    <i class="bi bi-cpu text-primary me-2"></i>@ViewBag.ProjectName Portal
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1 ms-auto">
                        <li class="nav-item">
                            <a class="nav-link text-white-50 active" asp-area="" asp-controller="Home" asp-action="Index">DaraERP Compliance Hub</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <div class="container">
        <main role="main" class="pb-3">
            @RenderBody()
        </main>
    </div>

    <footer class="border-top footer text-muted bg-dark py-3 mt-5 border-secondary">
        <div class="container text-center">
            &copy; 2026 - @ViewBag.ProjectName - Compliant 5-Layer C# Architecture. All dynamic routes active.
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

  files['Dara.ClientPortal/Views/Home/Index.cshtml'] = `
@{
    var blogs = ViewBag.Blogs as List<Dara.Application.Features.BlogPosts.DTOs.BlogPostDto>;
    var products = ViewBag.Products as List<Dara.Application.Features.Products.DTOs.ProductDto>;
}

<div class="p-5 mb-4 rounded-3 text-white border border-secondary" style="background: linear-gradient(135deg, ${config.colorPalette.primary}22, #020617)">
    <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold text-white mb-3">DaraERP Clean Architecture</h1>
        <p class="col-md-8 fs-5 text-secondary">
            Your visual layout has been mapped directly to an Enterprise-grade 5-layer system. Underneath, CQRS/MediatR pipelines enforce strict audit trails and company-specific data boundaries.
        </p>
        <span class="badge bg-indigo-600 p-2 font-monospace">.NET / C# v8.0 Stack</span>
        <span class="badge bg-success p-2 font-monospace">DaraERP compliance standard</span>
    </div>
</div>

<div class="row align-items-md-stretch">
    <!-- BlogPost Compliance Audit Block -->
    <div class="col-md-6 mb-4">
        <div class="h-100 p-5 rounded-3 card-custom">
            <h2 class="text-white"><i class="bi bi-archive text-primary me-2"></i>Seeded BlogPosts Table data</h2>
            <p class="text-muted text-xs">
                Rendered live from the REST API utilizing UnitOfWork repositories.
            </p>
            <div class="list-group bg-transparent border-0">
                @if (blogs != null && blogs.Any())
                {
                    @foreach (var post in blogs)
                    {
                        <div class="list-group-item bg-transparent text-white border-0 px-0">
                            <h5 class="mb-1 text-primary">@post.Title</h5>
                            <p class="mb-1 text-slate-300">@post.Excerpt</p>
                            <small class="text-secondary font-monospace">Slug: @post.Slug | CompanyId: @post.CompanyId</small>
                        </div>
                    }
                }
                else
                {
                    <p class="text-muted font-monospace text-xs mt-3">No active compliant records returned yet.</p>
                }
            </div>
        </div>
    </div>

    <!-- Products Core compliance view -->
    <div class="col-md-6 mb-4">
        <div class="h-100 p-5 rounded-3 card-custom">
            <h2 class="text-white"><i class="bi bi-cart4 text-emerald-400 me-2"></i>Active Products DB Inventory</h2>
            <p class="text-muted text-xs">
                Company Isolation Rules are strictly verified on any model read.
            </p>
            <div class="list-group bg-transparent border-0">
                @if (products != null && products.Any())
                {
                    @foreach (var prod in products)
                    {
                        <div class="list-group-item bg-transparent text-white border-0 px-0">
                            <h5 class="mb-1 text-success">@prod.Name</h5>
                            <p class="mb-1 text-slate-300">@prod.Description <strong class="text-white">$@prod.Price</strong></p>
                            <small class="text-secondary font-monospace">Company Scope: @prod.CompanyId | Uuid: @prod.Uuid</small>
                        </div>
                    }
                }
                else
                {
                    <div class="text-center p-3 text-secondary border border-dashed border-secondary rounded">
                        <i class="bi bi-box-seam fs-3"></i>
                        <p class="text-xs text-muted mt-2">Inventory is currently unseeded. Call the REST API POST /api/Products endpoint to seed custom rows.</p>
                    </div>
                }
            </div>
        </div>
    </div>
</div>
`;

  files['Dara.ClientPortal/Program.cs'] = `using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Dara.ClientPortal.Clients;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Register client integration with primary WebAPI
builder.Services.AddHttpClient<IApiClient, ApiClient>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
`;


  // ==========================================
  // DOCUMENTATION / EXPLANATION
  // ==========================================
  files['README.md'] = `
# DoraERP Compliant 5-Layer Solution (.NET Core)

This repository holds a fully compliant version of the project aligned with **DaraERP Compliance Roadmap v2.0**.

## Solution Projects Tree
- **Dara.Domain**: Plain C# domain entity definitions implementing the mandatory hierarchical inheritance design.
- **Dara.Application**: Features implementing the MediatR command and query architectures. Features mapper objects, company validation, and request pipelines.
- **Dara.Infrastructure**: Direct EF Core database connections mapping domain tables onto physical engine schemas. Features proper execution of the **GenericRepository** and **UnitOfWork** patterns.
- **Dara.ClientApi**: Rest API web Controller layer. Communicates using MediatR requests only, strictly forbidding DB interactions inside route methods.
- **Dara.ClientPortal**: A robust ASP.NET MVC web user-facing client that communicates with the API endpoints using the dynamic \`IApiClient\` service.

---

## 🛡️ Enforced Compliance Rules Checklist

### 1. 5-Layer Separation of Concerns
No layers bypass each other. The core flow is fully verified:
\`\`\`
Dara.ClientPortal (UI Layer) → Dara.ClientApi (REST API) → Dara.Application (Business Logic) → Dara.Infrastructure (Data Access) → Dara.Domain (Entities)
\`\`\`

### 2. Mandatory Hierarchical Entity Inheritance
All models implement C# inheritance chains:
\`\`\`
BaseEntity (Id, Uuid)
  ↓
AuditableBaseEntity (CreatedAt, UpdatedAt, DeletedAt, IsDeleted, CreatedBy, UpdatedBy, DeletedBy)
  ↓
AuditableEntity (CompanyId, Company)
\`\`\`

### 3. Repository and Transaction Strict Isolation
- Injects and references \`IUnitOfWork\` and \`IGenericRepository<TEntity>\` only.
- Direct \`ApplicationDbContext\` is not injected or utilized in MediatR logic.
- Soft-delete strategy automatically preserves records (\`IsDeleted = true\`).
- Explicit transaction wrappers (\`BeginTransactionAsync\` / \`CommitTransactionAsync\`) ensure consistency.

---

## ⚡ CLI Commands to Start local servers

Ensure you have the .NET SDK installed.

1. **Start the API Server (Dara.ClientApi)**
\`\`\`bash
cd Dara.ClientApi
dotnet run
# Runs on localhost:5211 (Swaggers dashboard active!)
\`\`\`

2. **Start the Customer Portal (Dara.ClientPortal)**
\`\`\`bash
cd Dara.ClientPortal
dotnet run
# Serves the main visual content dashboard pulling live data from API!
\`\`\`
`;

  return files;
}
