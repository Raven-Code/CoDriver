export const metadata = {
	title: 'About Us | CoDriver',
};
/**
 * Renders the About Us section of the CoDriver carpooling platform.
 * Provides information about the platform, its benefits, and key features.
 * Encourages users to join and experience the benefits of carpooling.
 *
 * @returns {JSX.Element} The rendered About Us page.
 */
export default function AboutUs(): JSX.Element {
	return (
		<div className='container m-auto my-4 color-primary'>
			<h2 className='text-4xl'>About Us</h2>
			<p>
				Welcome to CoDriver! We are dedicated to making your commuting and long-distance
				travel experiences more convenient, cost-effective, and environmentally friendly
				through carpooling. Our platform connects individuals who share similar routes,
				allowing them to coordinate and share rides, reducing traffic congestion, and
				promoting a greener transportation solution.
			</p>
			<p>
				At CoDriver, we understand the challenges of daily commuting and the rising costs
				associated with fuel and vehicle maintenance. That's why we've created a
				user-friendly platform that connects you with fellow travelers heading in the same
				direction. By carpooling with CoDriver, you can save money, reduce your carbon
				footprint, and even enjoy social interactions during your commute.
			</p>
			<p>
				Whether you're traveling to work, school, or planning a long-distance trip, CoDriver
				offers a reliable and secure carpooling network. Our platform prioritizes safety and
				trust, providing user verification and ratings to ensure a comfortable and secure
				experience for all our members.
			</p>
			<h2 className='text-4xl'>Key Features of CoDriver:</h2>
			<ol className='list-decimal px-5 pt-2'>
				<li>
					<strong>Easy Ride Matching:</strong> Our smart algorithm matches you with
					individuals who have similar commuting or travel routes, ensuring convenient
					carpooling arrangements.
				</li>
				<li>
					<strong>Cost Savings:</strong> Carpooling allows you to share the expenses of
					fuel and tolls, significantly reducing your transportation costs compared to
					driving alone.
				</li>
				<li>
					<strong>Environmental Benefits:</strong> By carpooling, you contribute to
					reducing traffic congestion and lowering greenhouse gas emissions, positively
					impacting the environment.
				</li>
				<li>
					<strong>Flexibility and Convenience:</strong> CoDriver offers flexible
					scheduling options, allowing you to find rides that fit your daily routine or
					plan long-distance trips in advance.
				</li>
				<li>
					<strong>Trust and Safety:</strong> We prioritize your safety by implementing
					user verification and ratings, ensuring a secure carpooling experience with
					reliable individuals.
				</li>
			</ol>

			<p>
				Join CoDriver today and experience the benefits of carpooling! Together, let's make
				commuting and long-distance travel more efficient, enjoyable, and sustainable.
			</p>
		</div>
	);
}
