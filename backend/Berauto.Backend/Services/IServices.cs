using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IServices<TEntity,TDto>
    {
        Task<IEnumerable<TEntity>> GetAllAsync(Func<IQueryable<TEntity>,IQueryable<TEntity>>incule=null);
        Task<TEntity> GetEntityById(int id);
        Task<bool> AddEntity(TDto dto,Func<TDto, TEntity> createEntity);
        Task<bool> UpdateEntity(int id, TDto dto, Action<TDto, TEntity> updateEntity);
        Task<bool> DeleteEntity(int id);
    }
}
