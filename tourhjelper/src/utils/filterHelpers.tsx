export const applyFilters = (data: any[], filters: any) => {
    return (data.filter((rider) => {
        let result = true;
        if (filters.category && rider.category !== filters.category) {
          result = false;
        }
        if (filters.team && rider.team !== filters.team) {
          result = false;
        }
        if (filters.name && !rider.name.toLowerCase().includes(filters.name.toLowerCase())) {
          result = false;
        }
        return result;
      }));
};