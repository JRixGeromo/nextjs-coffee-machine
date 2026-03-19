import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CoffeeButtons } from '../../../components/CoffeeMachine/CoffeeButtons'

describe('CoffeeButtons', () => {
  const mockOnMakeCoffee = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all coffee types', () => {
    const canMake = {
      espresso: true,
      double_espresso: true,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    // Check all coffee types are rendered
    expect(screen.getByText('Espresso')).toBeInTheDocument()
    expect(screen.getByText('Double Espresso')).toBeInTheDocument()
    expect(screen.getByText('Americano')).toBeInTheDocument()

    // Check recipes are displayed
    expect(screen.getByText('8g coffee, 24ml water')).toBeInTheDocument()
    expect(screen.getByText('16g coffee, 48ml water')).toBeInTheDocument()
    expect(screen.getByText('16g coffee, 148ml water')).toBeInTheDocument()
  })

  it('should enable buttons when coffee can be made', () => {
    const canMake = {
      espresso: true,
      double_espresso: false,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    const espressoButton = screen.getByText('Espresso').closest('button')
    const doubleEspressoButton = screen.getByText('Double Espresso').closest('button')
    const americanoButton = screen.getByText('Americano').closest('button')

    expect(espressoButton).not.toBeDisabled()
    expect(doubleEspressoButton).toBeDisabled()
    expect(americanoButton).not.toBeDisabled()
  })

  it('should disable all buttons when loading', () => {
    const canMake = {
      espresso: true,
      double_espresso: true,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={true}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('should call onMakeCoffee when button is clicked', async () => {
    const user = userEvent.setup()
    const canMake = {
      espresso: true,
      double_espresso: true,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    const espressoButton = screen.getByText('Espresso')
    await user.click(espressoButton)

    expect(mockOnMakeCoffee).toHaveBeenCalledWith('espresso')
  })

  it('should not call onMakeCoffee when disabled button is clicked', async () => {
    const user = userEvent.setup()
    const canMake = {
      espresso: false,
      double_espresso: false,
      americano: false,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    const espressoButton = screen.getByText('Espresso')
    await user.click(espressoButton)

    expect(mockOnMakeCoffee).not.toHaveBeenCalled()
  })

  it('should display correct icons', () => {
    const canMake = {
      espresso: true,
      double_espresso: true,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    expect(screen.getByText('☕')).toBeInTheDocument() // Espresso
    expect(screen.getByText('☕☕')).toBeInTheDocument() // Double Espresso
    expect(screen.getByText('🥤')).toBeInTheDocument() // Americano
  })

  it('should have proper CSS classes', () => {
    const canMake = {
      espresso: true,
      double_espresso: true,
      americano: true,
    }

    render(
      <CoffeeButtons
        canMake={canMake}
        loading={false}
        onMakeCoffee={mockOnMakeCoffee}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass('coffee-button')
    })
  })
})
