using Berauto.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class GenericServices<TEntity, TDto> : IServices<TEntity, TDto> where TEntity:class
    {
        private readonly CarRentalDbContext _context;
        public GenericServices(CarRentalDbContext _context)
        {
            this._context = _context;
        }
        public async Task<bool> AddEntity(TDto dto, Func<TDto, TEntity> createEntity)
        {
            var entity=createEntity(dto);
            await _context.Set<TEntity>().AddAsync(entity);
            await _context.SaveChangesAsync();
            if(!_context.Set<TEntity>().Contains(entity))
            {
                return false;
            }
            return true;
        }

        public async Task<bool> DeleteEntity(int id)
        {
            var entity = await GetEntityById(id);
            if(entity==null)
            {
                return false;
            }
            _context.Set<TEntity>().Remove(entity);
            return true;
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync(Func<IQueryable<TEntity>, IQueryable<TEntity>> include = null)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();
            if(include!=null)
            {
                query = include(query);
            }
            return await query.ToListAsync();
        }

        public async Task<TEntity> GetEntityById(int id)
        {
            var entity = await _context.Set<TEntity>().FindAsync(id);
            if(entity==null)
            {
                throw new NullReferenceException();
            }
            return entity;
        }

        public async Task<bool> UpdateEntity(int id, TDto dto, Action<TDto, TEntity> updateEntity)
        {
            var entity = await GetEntityById(id);
            if(entity==null)
            {
                return false;
            }
            updateEntity(dto, entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
