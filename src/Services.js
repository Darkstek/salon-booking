import './Services.css';
import ServiceCard from './ServiceCard';

const services = [
  { id: 1, name: 'Pedikúra', price: 700, duration: 60 },
  { id: 2, name: 'Manikúra', price: 350, duration: 45 },
  { id: 3, name: 'Úprava nehtů', price: 350, duration: 30 },
  { id: 4, name: 'Ošetření zarostlého nehtu', price: 150, duration: 10 },
  { id: 5, name: 'Gellak', price: 700, duration: 60 },
  { id: 6, name: 'Pedikúra a gellak', price: 850, duration: 90 },
  { id: 7, name: 'Aplikace titanové nitě', price: 750, duration: 30 },
  { id: 8, name: 'Aplikace nehtové špony', price: 750, duration: 30 },
];

function Services() {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Naše služby</h2>
      <ul>
        {services.map(service => (
          <ServiceCard
            key={service.id}
            name={service.name}
            price={service.price}
            duration={service.duration}
          />
        ))}
      </ul>
    </div>
  );
}

export default Services;