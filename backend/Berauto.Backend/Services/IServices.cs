using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public interface IServices<TEntity,TDto>
    {
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<TEntity> GetEntityById(int id);
        Task AddEntity(Func<TDto, TEntity> createEntity);
        Task UpdateEntity(int id, TDto dto, Action<TDto, TEntity> updateEntity);
        Task DeleteEntity(int id);
    }
}
