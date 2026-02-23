// Custom hooks placeholder
// Will be populated during migration phase

import { useState } from 'react';

export const useCounter = (initial: number = 0) => {
  const [count, setCount] = useState(initial);
  return { count, setCount };
};
