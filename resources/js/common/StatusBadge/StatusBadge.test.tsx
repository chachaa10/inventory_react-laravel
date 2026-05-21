import { render, screen } from '@testing-library/react';

import { StatusBadge } from './index';

describe('StatusBadge', () => {
    it('renders "In Stock" when stock is above reorder level', () => {
        render(<StatusBadge stockQty={50} reorderLevel={10} />);
        expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    it('renders "Low Stock" when stock is at or below reorder level', () => {
        render(<StatusBadge stockQty={5} reorderLevel={10} />);
        expect(screen.getByText('Low Stock')).toBeInTheDocument();
    });

    it('renders "Out of Stock" when stock is zero', () => {
        render(<StatusBadge stockQty={0} reorderLevel={10} />);
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('renders "Out of Stock" when stockQty is undefined', () => {
        render(<StatusBadge />);
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
});
