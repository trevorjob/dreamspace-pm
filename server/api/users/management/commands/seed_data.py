from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.projects.models import Project, Task
from api.moodboards.models import Moodboard, MoodboardItem
from api.vendors.models import ServiceCategory, ArtisanProfile, PortfolioItem, Review
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with comprehensive sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        ServiceCategory.objects.all().delete()
        
        self.stdout.write('Creating service categories...')
        carpentry = ServiceCategory.objects.create(
            name='Carpentry',
            description='Custom woodwork, furniture, and cabinetry services',
            icon='🪚'
        )
        
        painting = ServiceCategory.objects.create(
            name='Painting',
            description='Interior and exterior painting services',
            icon='🎨'
        )
        
        flooring = ServiceCategory.objects.create(
            name='Flooring',
            description='Hardwood, tile, and specialty flooring installation',
            icon='🏠'
        )
        
        upholstery = ServiceCategory.objects.create(
            name='Upholstery',
            description='Furniture upholstery and reupholstery services',
            icon='🛋️'
        )
        
        lighting = ServiceCategory.objects.create(
            name='Lighting',
            description='Custom lighting design and installation',
            icon='💡'
        )
        
        metalwork = ServiceCategory.objects.create(
            name='Metalwork',
            description='Custom metal fabrication and design',
            icon='🔧'
        )
        self.stdout.write('Creating designers...')
        designer1 = User.objects.create_user(
            email='adaeze.okonkwo@example.com',
            password='password123',
            first_name='Adaeze',
            last_name='Okonkwo',
            role='designer',
            phone='+234 803 456 7890',
            location='Lekki, Lagos',
            bio='Award-winning interior designer specializing in modern minimalist spaces with over 8 years of experience. Known for creating functional yet beautiful residential and commercial interiors that blend contemporary Nigerian aesthetics with international design trends.'
        )
        
        designer2 = User.objects.create_user(
            email='chidi.nnamdi@example.com',
            password='password123',
            first_name='Chidi',
            last_name='Nnamdi',
            role='designer',
            phone='+234 810 234 5678',
            location='Maitama, Abuja',
            bio='Contemporary design expert focused on sustainable and eco-friendly interiors. Specializes in blending modern aesthetics with environmental consciousness and traditional Nigerian craftsmanship.'
        )
        
        designer3 = User.objects.create_user(
            email='amina.yusuf@example.com',
            password='password123',
            first_name='Amina',
            last_name='Yusuf',
            role='designer',
            phone='+234 815 345 6789',
            location='Victoria Island, Lagos',
            bio='Luxury residential designer with a passion for timeless elegance and sophisticated color palettes. Expert in creating opulent spaces that reflect African luxury and contemporary international design.'
        )
        
        self.stdout.write('Creating clients...')
        client1 = User.objects.create_user(
            email='ngozi.eze@example.com',
            password='password123',
            first_name='Ngozi',
            last_name='Eze',
            role='client',
            phone='+234 806 456 7890',
            location='Ikoyi, Lagos'
        )
        
        client2 = User.objects.create_user(
            email='tunde.adebayo@example.com',
            password='password123',
            first_name='Tunde',
            last_name='Adebayo',
            role='client',
            phone='+234 813 567 8901',
            location='Bodija, Ibadan'
        )
        self.stdout.write('Creating artisans...')
        artisan1 = User.objects.create_user(
            email='oluwaseun.adeyemi@example.com',
            password='password123',
            first_name='Oluwaseun',
            last_name='Adeyemi',
            role='artisan',
            phone='+234 802 678 9012',
            location='Ikeja, Lagos',
            business_name='Adeyemi Carpentry Works',
            bio='Master carpenter with 15 years of experience in custom cabinetry and fine woodworking. Specializes in high-end residential projects across Lagos and beyond.',
            is_verified=True
        )
        
        artisan_profile1 = ArtisanProfile.objects.create(
            user=artisan1,
            business_name='Adeyemi Carpentry Works',
            description='Master carpenter specializing in custom cabinetry, built-in furniture, and fine woodworking. Over 15 years of experience creating beautiful, functional pieces for high-end residential and commercial spaces. Expert in traditional joinery techniques combined with modern design sensibilities. Proudly Nigerian, serving the greater Lagos area.',
            years_of_experience=15,
            experience_level='master',
            phone='+234 802 678 9012',
            email='oluwaseun.adeyemi@example.com',
            hourly_rate=42500.00,
            min_project_budget=2500000.00,
            is_available=True,
            is_featured=True,
            city='Lagos',
            state='Lagos',
            country='Nigeria',
            website='https://adeyemicarpentry.com.ng',
            instagram='@adeyemicarpentry'
        )
        artisan_profile1.services.add(carpentry)
        
        artisan2 = User.objects.create_user(
            email='fatima.bello@example.com',
            password='password123',
            first_name='Fatima',
            last_name='Bello',
            role='artisan',
            phone='+234 809 789 0123',
            location='Wuse, Abuja',
            business_name='Bello Painting Studio',
            bio='Professional painter specializing in decorative finishes, murals, and color consulting for luxury homes and commercial spaces.',
            is_verified=True
        )
        
        artisan_profile2 = ArtisanProfile.objects.create(
            user=artisan2,
            business_name='Bello Painting Studio',
            description='Professional painting contractor with expertise in interior/exterior painting, decorative finishes, and custom murals. Known for meticulous prep work and flawless execution. Color consultation services available. Serving Abuja and surrounding areas.',
            years_of_experience=10,
            experience_level='expert',
            phone='+234 809 789 0123',
            email='fatima.bello@example.com',
            hourly_rate=32500.00,
            min_project_budget=1000000.00,
            is_available=True,
            is_featured=True,
            city='Abuja',
            state='FCT',
            country='Nigeria',
            instagram='@bellopainting'
        )
        artisan_profile2.services.add(painting)
        
        artisan3 = User.objects.create_user(
            email='emeka.okoro@example.com',
            password='password123',
            first_name='Emeka',
            last_name='Okoro',
            role='artisan',
            phone='+234 805 890 1234',
            location='New Haven, Enugu',
            business_name='Okoro Flooring Experts',
            bio='Specialist in hardwood and luxury vinyl flooring with attention to detail and commitment to excellence.',
            is_verified=True
        )
        
        artisan_profile3 = ArtisanProfile.objects.create(
            user=artisan3,
            business_name='Okoro Flooring Experts',
            description='Expert flooring installer with 12+ years of experience. Specializes in hardwood flooring installation, refinishing, and luxury vinyl plank. Committed to precision and customer satisfaction. Proudly serving the Southeast region.',
            years_of_experience=12,
            experience_level='expert',
            phone='+234 805 890 1234',
            email='emeka.okoro@example.com',
            hourly_rate=37500.00,
            min_project_budget=1500000.00,
            is_available=True,
            is_featured=False,
            city='Enugu',
            state='Enugu',
            country='Nigeria'
        )
        artisan_profile3.services.add(flooring)
        
        artisan4 = User.objects.create_user(
            email='blessing.nwosu@example.com',
            password='password123',
            first_name='Blessing',
            last_name='Nwosu',
            role='artisan',
            phone='+234 807 901 2345',
            location='GRA, Port Harcourt',
            business_name='Nwosu Upholstery',
            bio='Custom upholstery and furniture restoration expert with a passion for bringing old pieces back to life.',
            is_verified=True
        )
        
        artisan_profile4 = ArtisanProfile.objects.create(
            user=artisan4,
            business_name='Nwosu Upholstery',
            description='Custom upholstery specialist and furniture restoration expert. Transforms old pieces into beautiful, functional furniture. Works with all fabric types and styles. Based in Port Harcourt, serving the Niger Delta region.',
            years_of_experience=8,
            experience_level='expert',
            phone='+234 807 901 2345',
            email='blessing.nwosu@example.com',
            hourly_rate=35000.00,
            min_project_budget=750000.00,
            is_available=True,
            is_featured=True,
            city='Port Harcourt',
            state='Rivers',
            country='Nigeria'
        )
        artisan_profile4.services.add(upholstery)
        
        artisan5 = User.objects.create_user(
            email='yusuf.ibrahim@example.com',
            password='password123',
            first_name='Yusuf',
            last_name='Ibrahim',
            role='artisan',
            phone='+234 811 012 3456',
            location='Kaduna South, Kaduna',
            business_name='Ibrahim Lighting Design',
            bio='Creative lighting solutions for residential and commercial spaces with modern energy-efficient designs.',
            is_verified=True
        )
        
        artisan_profile5 = ArtisanProfile.objects.create(
            user=artisan5,
            business_name='Ibrahim Lighting Design',
            description='Lighting design specialist creating atmospheric and functional lighting solutions. Expert in LED technology, smart home integration, and energy-efficient designs. Serving Northern Nigeria with world-class lighting solutions.',
            years_of_experience=11,
            experience_level='expert',
            phone='+234 811 012 3456',
            email='yusuf.ibrahim@example.com',
            hourly_rate=40000.00,
            min_project_budget=1250000.00,
            is_available=True,
            is_featured=False,
            city='Kaduna',
            state='Kaduna',
            country='Nigeria',
            website='https://ibrahimlighting.com.ng'
        )
        artisan_profile5.services.add(lighting)
        
        artisan6 = User.objects.create_user(
            email='chisom.okafor@example.com',
            password='password123',
            first_name='Chisom',
            last_name='Okafor',
            role='artisan',
            phone='+234 808 123 4567',
            location='Owerri, Imo',
            business_name='Okafor Metalworks',
            bio='Custom metal fabrication and artistic metalwork for gates, railings, and decorative pieces.',
            is_verified=True
        )
        
        artisan_profile6 = ArtisanProfile.objects.create(
            user=artisan6,
            business_name='Okafor Metalworks',
            description='Custom metal fabrication artist creating unique railings, gates, furniture, and decorative pieces. Combines traditional blacksmithing with modern welding techniques. Renowned across Southeast Nigeria for exceptional craftsmanship.',
            years_of_experience=14,
            experience_level='master',
            phone='+234 808 123 4567',
            email='chisom.okafor@example.com',
            hourly_rate=45000.00,
            min_project_budget=2000000.00,
            is_available=True,
            is_featured=True,
            city='Owerri',
            state='Imo',
            country='Nigeria',
            instagram='@okaformetalworks'
        )
        artisan_profile6.services.add(metalwork)
        self.stdout.write('Creating portfolio items...')
        # Carpenter Portfolio (Oluwaseun Adeyemi)
        PortfolioItem.objects.create(
            artisan=artisan_profile1,
            title='Custom Walnut Kitchen Cabinets',
            description='Handcrafted walnut kitchen cabinets featuring soft-close Blum hinges, hand-forged brass hardware, and seamless integration with professional-grade appliances. This 3-week project included a massive 10-foot island with built-in wine storage for 48 bottles, custom spice drawers with individual compartments, and pull-out trash/recycling stations. All joints are traditional mortise-and-tenon construction, finished with 6 coats of hand-rubbed oil for a lustrous, durable surface that will age beautifully. The grain matching across all cabinet faces creates a continuous flow that elevates the entire space.',
            image='https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
            client_name='Akinlade Residence, Banana Island'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile1,
            title='Built-in Library Shelving',
            description='Floor-to-ceiling white oak library spanning an entire 14-foot wall with integrated rolling ladder system. Custom-designed to fit architectural details including crown molding and baseboards, with adjustable shelving to accommodate everything from art books to paperbacks. Features include hidden LED strip lighting, cable management for charging stations, and a built-in ladder track system with custom brass hardware. The shelving maximizes storage capacity while maintaining elegant proportions - each shelf is precisely calculated for optimal strength without visible sagging. Finished with water-based polyurethane for a clear, natural appearance that won\'t yellow over time.',
            image='https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
            client_name='Olanrewaju Estate, Ikoyi'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile1,
            title='Mid-Century Modern Credenza',
            description='Stunning mid-century modern inspired credenza crafted from sustainably sourced cherry wood with aged brass accents. This 72-inch piece features tapered legs, tambour doors with custom-made tracks, hidden compartments behind false drawer fronts, and custom dividers in each drawer for silverware and linens. The brass hardware was custom fabricated to match vintage Danish designs. Interior drawers are lined with felt, and the top surface received extra coats of finish for heat and water resistance. Took approximately 120 hours of meticulous handwork to complete.',
            image='https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
            client_name='Private Client, Victoria Island'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile1,
            title='Floating Vanity with Live Edge',
            description='Contemporary bathroom vanity featuring a stunning black walnut live edge slab as the countertop, suspended on a custom steel frame I fabricated in collaboration with a local metalworker. The 6-foot slab was carefully selected for its dramatic grain pattern and natural edge. Includes integrated undermount sink, soft-close drawers with custom organizers, and waterproof finish. The piece appears to float off the wall, creating a sculptural focal point in the master bathroom.',
            image='https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
            client_name='Modern Lekki Retreat'
        )
        
        # Painter Portfolio (Fatima Bello)
        PortfolioItem.objects.create(
            artisan=artisan_profile2,
            title='Geometric Feature Wall - Living Room',
            description='Sophisticated geometric accent wall using 7 different paint finishes and precise taping techniques. Created using Benjamin Moore Aura paint in a carefully curated palette of grays, navy, and soft gold. The design features overlapping triangles and hexagons that create depth and visual interest without overwhelming the modern living space. Each section required 2-3 coats for perfect coverage and color saturation. The project took 4 days including planning, taping, painting, and finishing. Used mathematical precision to ensure all angles and shapes aligned perfectly.',
            image='https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
            client_name='Ogunleye Apartment, Maitama'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile2,
            title='Victorian Home Exterior Restoration',
            description='Complete exterior restoration of a historic 1890s Victorian home using period-authentic Sherwin Williams Historic Colors collection. This 3-week project required extensive surface preparation including scraping, wood repair, priming, and multiple finish coats. The color scheme features a warm cream body, forest green trim, burgundy accents, and cream details - all researched to match the home\'s original era. Special attention to architectural details including ornate gingerbread trim, corbels, and window casings. Used specialized primers for various substrates and premium exterior paints rated for 15+ year durability.',
            image='https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            client_name='Heritage House, Asokoro'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile2,
            title='Whimsical Woodland Nursery Mural',
            description='Hand-painted woodland creatures mural for a baby nursery, featuring friendly foxes, owls, deer, and rabbits among birch trees and ferns. Painted with zero-VOC, non-toxic Benjamin Moore Natura paints in soft, soothing colors. The 10-foot mural creates a magical forest scene that wraps around two walls. Each animal has its own personality and was sketched, approved by the parents, then carefully painted over 5 days. Includes fine details like individual leaves, grass blades, and tiny mushrooms. Sealed with a protective matte finish that can be gently cleaned.',
            image='https://images.unsplash.com/photo-1609770231080-e321deccc34c?w=800',
            client_name='Adewale Family, Wuse'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile2,
            title='Ombré Dining Room',
            description='Stunning ombré effect in a formal dining room, transitioning from deep charcoal at the floor to soft dove gray at the ceiling. This advanced technique required custom mixing 8 shades of gray and careful blending where each color meets. The gradient creates an elegant, sophisticated atmosphere perfect for entertaining. Took 3 days including multiple blending sessions while paint was still wet to achieve seamless transitions.',
            image='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
            client_name='Elegance Dining, Jabi'
        )
        
        # Flooring Expert Portfolio (Emeka Okoro)
        PortfolioItem.objects.create(
            artisan=artisan_profile3,
            title='Herringbone White Oak Flooring',
            description='Classic herringbone pattern white oak flooring installation throughout 2,000 sq ft main level. Each 3-inch wide plank precision-cut at 45-degree angles and laid in the traditional herringbone pattern. Custom stained with a warm honey tone to complement existing woodwork and cabinetry. Required meticulous planning to center the pattern in each room and maintain consistent angles throughout doorways and transitions. Finished with 3 coats of water-based polyurethane for durability and a smooth matte appearance. Installation took 2 weeks including acclimation time.',
            image='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            client_name='GRA Apartment, Enugu'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile3,
            title='Reclaimed Barn Wood Floors',
            description='Authentic reclaimed barn wood flooring sourced from 1800s Pennsylvania barn. Each plank hand-selected for character, color variation, and structural integrity. Boards range from 6-12 inches wide and feature saw marks, nail holes, and natural weathering that tell the building\'s story. All wood was kiln-dried, planed to consistent thickness, and coated with commercial-grade matte finish. The random-width installation creates visual interest while the varying tones - from silvered gray to warm brown - add depth. Perfect for this modern farmhouse renovation seeking authentic rustic character.',
            image='https://images.unsplash.com/photo-1615873968403-89e068629265?w=800',
            client_name='Modern Farmhouse, Independence Layout'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile3,
            title='Luxury Vinyl Plank - Waterproof Installation',
            description='Premium luxury vinyl plank flooring throughout kitchen, bathrooms, and laundry - 800 sq ft total. Chose a realistic oak pattern with texture and color variation that mimics real hardwood. 100% waterproof core makes it perfect for wet areas while maintaining the warm aesthetic of wood. Includes custom transitions to existing hardwood, precise cuts around cabinetry and fixtures, and vapor barrier underlayment for soundproofing. The click-lock installation ensures stability while allowing for future removal if needed.',
            image='https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
            client_name='Onuoha Residence, Emene'
        )
        
        # Upholstery Expert Portfolio (Blessing Nwosu)
        PortfolioItem.objects.create(
            artisan=artisan_profile4,
            title='Danish Modern Sofa Restoration',
            description='Complete restoration of a 1965 Danish modern teak sofa originally designed by Grete Jalk. This museum-quality restoration involved completely dismantling the piece, rebuilding the frame with new corner blocks and joints, replacing all springs and webbing, adding new high-density foam cushions with down toppers, and reupholstering in Maharam wool fabric that matches the original color but with modern durability. Teak frame was carefully cleaned and treated with oil. The piece required 40+ hours of work and now looks and feels better than new while maintaining its vintage character.',
            image='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            client_name='Vintage Collector, Old GRA'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile4,
            title='Custom Tufted Dining Chairs',
            description='Set of 6 dining chairs completely reupholstered in luxurious peacock blue velvet with custom diamond tufting pattern. Each button hand-covered in matching fabric. Removed old fabric and padding, repaired frames, added new high-resilience foam padding, and wrapped in premium velvet. The tufting adds visual interest and comfortable back support. Coordinating seats feature subtle padding for comfort during long dinners. Modern update to these traditional Chippendale-style chairs creates a perfect blend of classic and contemporary.',
            image='https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
            client_name='Chukwu Dining Room, Trans Amadi'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile4,
            title='Leather Club Chair Restoration',
            description='Restored a worn 1940s leather club chair to its former glory. Sourced premium top-grain leather in cognac brown to match the original. Repaired frame joints, replaced springs, added new horsehair and cotton batting (traditional materials), and hand-stitched all leather panels. Brass nailhead trim applied individually by hand. The piece now has another 50+ years of life ahead of it and serves as a stunning focal point in a home library.',
            image='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            client_name='Estate Library, Elelenwo'
        )
        
        # Lighting Designer Portfolio (Yusuf Ibrahim)
        PortfolioItem.objects.create(
            artisan=artisan_profile5,
            title='Kitchen Island Pendant Array',
            description='Custom pendant lighting installation over a 10-foot kitchen island featuring three hand-blown glass pendants with brass fittings. Designed the layout to provide even task lighting while creating visual interest. Installed with individual dimmer controls and integrated with Lutron smart home system for scene programming. Wiring includes separate circuits and decorative cloth-covered cords. Lights hang at optimal height (30 inches above counter) for functionality without blocking sightlines. The warm glow creates perfect ambiance for both cooking and entertaining.',
            image='https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
            client_name='Modern Kitchen, Kaduna South'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile5,
            title='Living Room Layered Lighting Design',
            description='Comprehensive lighting plan for living room including recessed LED cans, picture lights for artwork, wall sconces, and floor lamps - all on separate dimmers and smart switches. Created zones for reading, TV watching, and entertaining. Specified warm 2700K color temperature throughout for cozy atmosphere. Includes Philips Hue integration for color-changing accent lights. The layered approach allows infinite lighting scenes from bright and energizing to soft and intimate.',
            image='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
            client_name='Contemporary Living, Barnawa'
        )
        
        # Metalwork Artist Portfolio (Chisom Okafor)
        PortfolioItem.objects.create(
            artisan=artisan_profile6,
            title='Geometric Stair Railing',
            description='Modern architectural stair railing featuring geometric patterns in powder-coated matte black steel with walnut handrail. The design incorporates repeating triangular patterns that create visual rhythm while meeting building codes for safety. All steel components custom-fabricated in my shop using precise measurements from the site. Welded joints ground smooth and finished to appear seamless. The walnut handrail was custom-milled and shaped for ergonomic comfort, attached with concealed fasteners. This piece transforms a standard stairway into a sculptural design element.',
            image='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
            client_name='Industrial Loft, Owerri'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile6,
            title='Custom Metal Entry Gate',
            description='Ornate yet contemporary entry gate featuring scrollwork and geometric patterns in wrought iron with powder-coated bronze finish. The 8-foot double gate includes custom hinges, automatic closer, and integrated lock mechanism. Each scroll hand-forged and hammered for texture and dimension. The design balances security with aesthetics, creating an impressive entry statement. Includes matching side panels and custom house number plaque.',
            image='https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
            client_name='Estate Entrance, New Owerri'
        )
        
        PortfolioItem.objects.create(
            artisan=artisan_profile6,
            title='Industrial Coffee Table',
            description='Industrial-style coffee table combining blackened steel base with reclaimed wood top. The steel base features clean lines with cross-bracing and brushed finish. Reclaimed oak top from a 100-year-old barn floor provides character and warmth. Clear epoxy finish protects the wood while highlighting its natural texture. Custom-designed to complement modern loft aesthetic while being built to last generations.',
            image='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            client_name='Urban Loft, World Bank'
        )
        self.stdout.write('Creating reviews...')

        # Reviews for Oluwaseun Adeyemi (Carpenter)
        Review.objects.create(
            artisan=artisan_profile1,
            reviewer=designer1,
            rating=5,
            title='Exceptional Craftsmanship - Kitchen Cabinets',
            comment='Oluwaseun built custom walnut cabinets for my client\'s kitchen in Banana Island and the attention to detail was absolutely incredible. Every joint is perfect, the finish is flawless, and the functionality exceeds all expectations. The soft-close mechanisms work beautifully, and the wine storage integration is genius. He worked closely with me on the design, offering valuable suggestions that improved the final result. His workshop in Ikeja is well-equipped and his process is highly professional. The cabinets were delivered on time despite Lagos traffic challenges, and installation was smooth. I\'ve already recommended him to three other clients across Lagos and Abuja. Worth every naira!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile1,
            reviewer=designer2,
            rating=5,
            title='Master Craftsman - Library Project',
            comment='Working with Oluwaseun on a built-in library in Ikoyi was a pleasure from start to finish. His expertise in woodworking is evident in every detail - from the precision of the joints to the grain matching across all the pieces. The integrated ladder system works flawlessly and adds such elegance to the space. He was professional, punctual, and his communication throughout the project was excellent. He provided regular WhatsApp updates with photos and was always available to discuss design modifications. The installation was completed ahead of schedule, which is rare in Lagos! Will definitely hire again for future projects requiring fine woodworking.',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile1,
            reviewer=client1,
            rating=5,
            title='Beautiful Custom Credenza',
            comment='Our mid-century credenza is absolutely stunning! Oluwaseun captured exactly what we envisioned and added thoughtful details we hadn\'t even considered. The hidden compartments are clever, the brass hardware is beautiful, and the cherry wood finish is gorgeous. The piece fits perfectly in our Victoria Island dining room and has become a conversation starter at every dinner party. Oluwaseun was patient with our many questions, provided detailed drawings before starting, and kept us updated throughout the 6-week build. Highly recommend for anyone in Lagos seeking quality custom furniture!',
            professionalism=5,
            quality_of_work=5,
            timeliness=4,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile1,
            reviewer=designer3,
            rating=4,
            title='Great Quality, Minor Timeline Issues',
            comment='Oluwaseun created a beautiful floating vanity with live edge for our Lekki project. The quality is exceptional - the walnut slab is stunning and the craftsmanship is top-notch. Only giving 4 stars because there was a 2-week delay due to sourcing the perfect slab locally, which pushed back our overall timeline. However, Oluwaseun communicated the delay immediately via WhatsApp and was transparent about the reasons. In hindsight, the wait was worth it because the piece is truly special. Would work with him again but would build in extra time for custom pieces. His dedication to quality is unmatched in Lagos!',
            professionalism=5,
            quality_of_work=5,
            timeliness=3,
            communication=4
        )
        
        # Reviews for Fatima Bello (Painting)
        Review.objects.create(
            artisan=artisan_profile2,
            reviewer=designer1,
            rating=5,
            title='Artistic Perfection - Geometric Wall',
            comment='Fatima created an absolutely stunning geometric accent wall in our client\'s living room in Maitama. Her attention to detail is remarkable - every line is crisp, every angle is perfect, and the color blending is flawless. She brings an artist\'s eye to painting work, which is rare to find in Abuja. The project required complex taping and multiple paint finishes, which she executed brilliantly. Clean work throughout, protected all furniture and floors meticulously. Cleaned up each day before leaving. The result is museum-quality work that truly elevated the entire space. I now use Fatima for all my high-end residential projects in the FCT.',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile2,
            reviewer=client2,
            rating=4,
            title='Great Results on Heritage Home',
            comment='Very professional painting service. Fatima and her team did an amazing job on the exterior of our heritage home in Asokoro. The prep work was thorough - they spent almost a week scraping and repairing before any painting began. The finished product looks fantastic and the color consultation was invaluable in selecting the perfect palette that respects the building\'s history. Had some minor scheduling delays at the start due to weather (you know Abuja rainy season!), but once they got going, the work progressed smoothly. Fair pricing for the quality delivered. Would definitely hire again.',
            professionalism=4,
            quality_of_work=5,
            timeliness=3,
            communication=4
        )
        
        Review.objects.create(
            artisan=artisan_profile2,
            reviewer=designer3,
            rating=5,
            title='Nursery Mural Magic',
            comment='Fatima hand-painted the most adorable woodland mural in our client\'s nursery in Wuse 2. The parents absolutely love it! She worked from rough sketches and brought the concept to life beautifully. Each animal has personality and charm. She used only non-toxic paints, which was essential for a baby\'s room - this was very important to the parents. Very patient with changes and modifications during the process. The level of detail is impressive - even tiny mushrooms and grass blades are perfectly rendered. This is art, not just painting. Highly recommend for anyone in Abuja seeking custom murals or decorative painting work.',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile2,
            reviewer=client1,
            rating=5,
            title='Ombré Dining Room - Stunning!',
            comment='Fatima created a gorgeous ombré effect in our Jabi dining room that everyone who visits asks about. The gradient from charcoal to light gray is so smooth and sophisticated. I wasn\'t sure about the idea at first, but Fatima showed me examples from her portfolio and walked me through the process. I\'m so glad I trusted her vision! The technique required custom mixing multiple shades and careful blending, which she made look easy. Professional, clean, and the result is absolutely stunning. Best decision we made in our renovation. She\'s truly one of the best in Abuja!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        # Reviews for Emeka Okoro (Flooring)
        Review.objects.create(
            artisan=artisan_profile3,
            reviewer=designer2,
            rating=5,
            title='Herringbone Perfection',
            comment='Emeka installed herringbone hardwood floors throughout our client\'s apartment in GRA Enugu and they are absolutely perfect. Every cut, every angle, every transition - flawless execution. The pattern is centered beautifully in each room and flows seamlessly through doorways. His precision is remarkable. The custom stain color matches the existing woodwork exactly as requested. Emeka is a true craftsman who takes pride in his work. He protected everything carefully, cleaned up daily, and was always on time. The floors are the showpiece of this renovation. Highly recommend for anyone in the Southeast!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile3,
            reviewer=client1,
            rating=5,
            title='Reclaimed Wood Floors - Worth Every Naira',
            comment='The reclaimed barn wood floors Emeka installed are the highlight of our modern farmhouse in Independence Layout. He sourced beautiful old wood with amazing character - every board tells a story. The installation was meticulous - he took time to arrange boards for the best color and texture variation. The finish protects the wood while maintaining its authentic aged appearance. Emeka was great about explaining the process, showing us samples, and making sure we were happy at every step. Project took 2 weeks and was completed exactly on schedule. Couldn\'t be happier! Best flooring expert in Enugu!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile3,
            reviewer=designer1,
            rating=4,
            title='Quality LVP Installation',
            comment='Emeka did a great job installing luxury vinyl plank in our client\'s kitchen and bathrooms in Emene. The waterproof flooring was perfect for these spaces and looks surprisingly like real wood - great for Nigerian homes where water is a constant concern. All the cuts around cabinets and fixtures are precise, and the transitions to existing hardwood are seamless. Good value for the quality. Only minor issue was some confusion about underlayment specifications at the start, but once clarified via phone call, everything went smoothly. Would hire again for similar projects in Enugu.',
            professionalism=4,
            quality_of_work=5,
            timeliness=4,
            communication=4
        )
        
        # Reviews for Blessing Nwosu (Upholstery)
        Review.objects.create(
            artisan=artisan_profile4,
            reviewer=designer1,
            rating=5,
            title='Masterful Furniture Restoration',
            comment='Blessing restored a vintage Danish modern sofa for our client in Old GRA Port Harcourt and the transformation is incredible! She completely rebuilt the frame, replaced all the springs and webbing, and reupholstered it in beautiful imported fabric. The piece now looks and feels better than new while maintaining its vintage character. Her craftsmanship and attention to detail are exceptional. She provided fabric samples, explained all the restoration steps, and sent progress photos via WhatsApp. The wood restoration was particularly impressive. For anyone in the Niger Delta with vintage furniture worth saving, Blessing is the artisan to call. True museum-quality work!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile4,
            reviewer=designer3,
            rating=5,
            title='Dining Chairs Transformation',
            comment='Blessing reupholstered our client\'s dining chairs in Trans Amadi with peacock velvet and custom tufting - they are absolutely stunning! The transformation from dated to glamorous is remarkable. Each button is hand-covered, every seam is perfect, and the tufting pattern adds such visual interest. The chairs are now a showpiece in the dining room. Blessing helped select the perfect fabric that can withstand Port Harcourt\'s humidity and provided excellent guidance on durability for dining chairs. Professional, skilled, and creative. I now send all my upholstery work to her - best in Rivers State!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile4,
            reviewer=client2,
            rating=5,
            title='Leather Club Chair Looks Amazing',
            comment='Blessing restored my grandfather\'s leather club chair and brought it back to life! The new leather is gorgeous, the brass nailheads are perfect, and the frame is solid again. She sourced premium leather that matches the original color beautifully - not easy to find quality leather in Port Harcourt but she has the right connections. The craftsmanship is old-school quality - hand-stitched with traditional materials. Took about 6 weeks but was worth the wait. Now this chair will last another 50 years and stay in the family. Blessing clearly loves what she does and it shows in her work. Highly recommend!',
            professionalism=5,
            quality_of_work=5,
            timeliness=4,
            communication=5
        )
        
        # Reviews for Yusuf Ibrahim (Lighting Design)
        Review.objects.create(
            artisan=artisan_profile5,
            reviewer=designer2,
            rating=5,
            title='Lighting Design Expertise',
            comment='Yusuf created the perfect lighting plan for our modern kitchen remodel in Kaduna South. His expertise in both aesthetics and technical aspects is invaluable, especially dealing with NEPA power fluctuations. The pendant lights over the island provide excellent task lighting while creating a beautiful focal point. He integrated everything with smart home systems and even programmed backup solutions for when power is unstable. He trained the homeowners on how to use everything. The combination of ambient, task, and accent lighting transforms the space from morning to evening. Yusuf understands how lighting affects mood and functionality. Worth every naira for his design expertise!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile5,
            reviewer=designer1,
            rating=5,
            title='Layered Lighting Excellence',
            comment='Yusuf designed and installed a comprehensive lighting system for our client\'s living room in Barnawa - recessed lights, sconces, picture lights, and floor lamps all on separate dimmers and smart controls. The result is magical. You can create any atmosphere from bright and energizing to soft and intimate. His understanding of light quality, color temperature, and placement is expert-level. Installation was clean and professional despite the challenges of working in Kaduna. He took time to program scenes and teach the homeowners the system. Every designer in Northern Nigeria needs a lighting expert like Yusuf on their team!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        # Reviews for Chisom Okafor (Metalwork)
        Review.objects.create(
            artisan=artisan_profile6,
            reviewer=designer1,
            rating=5,
            title='Sculptural Metalwork',
            comment='Chisom created a stunning custom stair railing for our industrial loft project in Owerri that is functional art. The geometric design is both modern and timeless, and the integration of powder-coated steel with walnut handrail is perfect. His welding skills are exceptional - all joints are seamless and ground smooth. The piece was fabricated in his workshop to exact specifications and installation was flawless despite logistical challenges. Chisom is an artist who happens to work in metal. He understood our design vision immediately and enhanced it with his own creative touches. The railing has transformed the stairway into a sculptural focal point. Highly recommend for anyone in the Southeast seeking custom metalwork!',
            professionalism=5,
            quality_of_work=5,
            timeliness=5,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile6,
            reviewer=designer2,
            rating=5,
            title='Custom Entry Gate Excellence',
            comment='Chisom fabricated a beautiful custom entry gate for our estate project in New Owerri. The design balances ornate scrollwork with contemporary geometric elements perfectly - very fitting for a modern Nigerian home. Every detail - from the hand-forged texture to the powder-coated finish - is perfect. The automatic closer and integrated lock work smoothly even in the humid Imo climate. Chisom provided detailed drawings, was responsive to modifications via calls and WhatsApp, and completed the project on schedule. His craftsmanship is old-world quality combined with modern techniques. The gate makes a stunning first impression and will last generations.',
            professionalism=5,
            quality_of_work=5,
            timeliness=4,
            communication=5
        )
        
        Review.objects.create(
            artisan=artisan_profile6,
            reviewer=client1,
            rating=4,
            title='Industrial Coffee Table',
            comment='Chisom built us a beautiful industrial-style coffee table with blackened steel base and reclaimed wood top for our loft in World Bank area. The piece is solid, stylish, and exactly what we wanted. Quality is excellent and it\'s built to last forever - typical Igbo craftsmanship! Only minor issue was the project took a bit longer than originally estimated (8 weeks vs. 6 weeks) due to sourcing the perfect reclaimed wood locally in Owerri. Chisom kept us informed throughout and the extra wait was worth it. The table is a centerpiece in our living room. Fair pricing for custom metalwork of this caliber in Imo State.',
            professionalism=4,
            quality_of_work=5,
            timeliness=3,
            communication=4
        )
        for profile in [artisan_profile1, artisan_profile2, artisan_profile3, 
                       artisan_profile4, artisan_profile5, artisan_profile6]:
            reviews = Review.objects.filter(artisan=profile)
            if reviews.exists():
                avg_rating = sum(r.rating for r in reviews) / len(reviews)
                profile.average_rating = round(avg_rating, 2)
                profile.total_reviews = len(reviews)
                profile.save()
        
        self.stdout.write('Creating projects...')
        project1 = Project.objects.create(
            name='Modern Industrial Loft Renovation - Lekki',
            description='Complete transformation of a 2,000 sq ft raw industrial loft space in Lekki Phase 1. Converting concrete shell into sophisticated modern living space featuring open concept kitchen with custom walnut cabinetry, exposed brick accent walls, polished concrete floors throughout, and custom steel and wood staircase. The design celebrates the industrial heritage while adding contemporary comfort and functionality perfect for Lagos living. Key features include floor-to-ceiling windows with Lagos skyline views, 14-foot ceilings with exposed ductwork, integrated smart home systems with backup power solutions, and a carefully curated material palette of natural wood, blackened steel, and warm textiles. The space will include distinct zones for living, dining, working, and sleeping while maintaining the airy, open feel. Budget: ₦72,000,000. Timeline: 3 months.',
            user=designer1,
            client_name='Adebayo Family',
            start_date=datetime.now().date() - timedelta(days=45),
            end_date=datetime.now().date() + timedelta(days=45)
        )
        
        project2 = Project.objects.create(
            name='Contemporary Lakeside Villa - Abuja',
            description='Interior design for new construction 3,500 sq ft luxury lakeside villa near Jabi Lake. Creating a serene, sophisticated retreat with light, airy palette inspired by the natural surroundings. Design emphasizes indoor-outdoor living with expansive sliding glass doors, covered outdoor living spaces, and materials that can withstand Abuja\'s climate. Features include custom millwork throughout, curated Nigerian art collection display, chef\'s kitchen with lake views, spa-like master bathroom, and family entertainment room. Material palette includes white oak flooring, locally-sourced stone accents, natural linen fabrics, and earth-tone accents reflecting Nigerian landscape. Furniture selections blend comfortable, durable pieces with refined details from both local and international sources. Budget: ₦112,000,000. Timeline: 5 months.',
            user=designer1,
            client_name='Okafor Family',
            start_date=datetime.now().date() + timedelta(days=20),
            end_date=datetime.now().date() + timedelta(days=150)
        )
        
        project3 = Project.objects.create(
            name='VI Apartment - Minimalist Makeover',
            description='Modern minimalist transformation of a 1,200 sq ft Victoria Island apartment for young professional. Maximizing storage with custom built-ins, improving flow between spaces, and creating a calm, sophisticated environment that serves as a peaceful retreat from busy Lagos life. Design focuses on quality over quantity - every piece carefully selected. Neutral palette of warm grays, whites, and natural wood creates timeless backdrop. Custom herringbone white oak floors throughout, built-in closet systems, smart lighting design with energy efficiency, and multifunctional furniture. Kitchen update includes new cabinetry, granite counters, and integrated appliances. Living room features custom window seat with storage and gallery wall for Nigerian contemporary art collection. Budget: ₦38,000,000. Timeline: 2 months.',
            user=designer2,
            client_name='Chidinma Okonkwo',
            start_date=datetime.now().date() - timedelta(days=20),
            end_date=datetime.now().date() + timedelta(days=40)
        )
        
        project4 = Project.objects.create(
            name='Contemporary Restaurant Interior - Wuse 2',
            description='Complete interior design for new 2,800 sq ft farm-to-table restaurant in Wuse 2, Abuja. Open kitchen concept showcases chef and cooking process. Modern industrial aesthetic with warm Nigerian touches - blackened steel, reclaimed wood, concrete, tropical plants, and custom lighting. Seating for 75 including bar area, communal table, and intimate booths. Custom elements include live-edge bar top from local wood, hand-forged light fixtures, custom booth seating, decorative tile work featuring African patterns, and living plant wall with local species. Acoustical treatments ensure comfortable noise levels in the bustling Abuja dining scene. Material selections are durable, easy-to-clean, and create Instagram-worthy atmosphere that reflects the restaurant\'s commitment to local sourcing and quality. Project completed on time and under budget! Budget: ₦70,000,000.',
            user=designer2,
            client_name='Chef Emeka - Afropolitan Kitchen',
            start_date=datetime.now().date() - timedelta(days=120),
            end_date=datetime.now().date() - timedelta(days=15)
        )
        
        project5 = Project.objects.create(
            name='Luxury Penthouse - Ikoyi',
            description='High-end penthouse renovation for prominent Lagos family in Old Ikoyi. Completely transforming dated 4,000 sq ft space into sophisticated modern residence befitting Nigeria\'s business elite. Features include custom millwork throughout (library, wine cellar, walk-in closets), imported Italian marble in bathrooms and kitchen, integrated smart home system with uninterrupted power backup, custom lighting design, and curated furniture selections including several custom pieces from Nigerian artisans. Master suite includes spa bathroom with steam shower and soaking tub, custom walk-in closet system, and private balcony with Atlantic Ocean views. Gourmet kitchen with professional appliances and separate spice kitchen. Home office with built-in cabinetry and AV system for international business calls. Every detail considered from door hardware to automated curtains. White glove installation and project management. Budget: ₦340,000,000. Timeline: 5 months.',
            user=designer3,
            client_name='Adeleke Family',
            start_date=datetime.now().date() - timedelta(days=60),
            end_date=datetime.now().date() + timedelta(days=90)
        )
        
        project6 = Project.objects.create(
            name='Boutique Hotel Lobby & Common Areas - Calabar',
            description='Redesign of boutique hotel lobby, lounge, and common areas to create welcoming, Instagram-worthy spaces that reflect Cross River culture and local artisan craftsmanship. Goal is to transform generic hotel into destination with unique sense of place celebrating Nigerian hospitality. Design celebrates regional makers - featuring local artists from Calabar and Akwa Ibom, custom furniture from area craftspeople, and materials sourced from nearby suppliers. Lobby features dramatic double-height space with statement chandelier inspired by Calabar carnival, custom reception desk in local mahogany, lounge seating arranged in conversation groups reflecting Nigerian communal culture, and gallery wall showcasing regional photographers. Color palette inspired by Calabar\'s natural beauty and cultural festivals. Materials include natural stone, raw steel, hand-woven textiles from local weavers, and ceramic tile. Library/lounge features floor-to-ceiling bookshelves with Nigerian literature, fireplace, and coffee bar serving local beans. Budget: ₦128,000,000. Timeline: 3 months.',
            user=designer3,
            client_name='Tinapa Resort Group',
            start_date=datetime.now().date() + timedelta(days=30),
            end_date=datetime.now().date() + timedelta(days=120)
        )
        
        self.stdout.write('Creating tasks...')
        # Project 1: Modern Industrial Loft Lekki - Tasks
        Task.objects.create(
            project=project1,
            title='Install custom walnut kitchen cabinets',
            description='Coordinate with Oluwaseun Adeyemi (Adeyemi Carpentry Works) for complete custom kitchen cabinetry installation. Scope includes: 10-foot island with integrated wine storage (48 bottles), soft-close Blum hinges throughout, hand-forged brass hardware, custom spice drawer organizers for Nigerian spices and ingredients, pull-out trash/recycling stations, and appliance garage. All cabinets feature traditional mortise-and-tenon joinery and 6 coats hand-rubbed oil finish suitable for Lagos humidity. Island will also serve as visual centerpiece with waterfall edge detail. Requires coordination with plumber and electrician for sink/dishwasher rough-in. Factor in Lagos traffic for material delivery. Allow 2 weeks for installation and finishing.',
            status='in_progress',
            due_date=datetime.now().date() + timedelta(days=14)
        )
        
        Task.objects.create(
            project=project1,
            title='Paint accent walls - exposed brick treatment',
            description='Work with Fatima Bello (Bello Painting Studio) for custom paint treatment on exposed brick walls. Project includes: sealing existing brick to withstand Lagos humidity, custom mixed warm gray paint for non-brick accent walls to complement brick tones, and protective matte finish on brick. Fatima will provide color samples for approval before starting. Two accent walls in main living area require this treatment. Coordinate timing after flooring is complete to avoid overspray. Paint must be mold-resistant given Lagos climate. Estimated 3-4 days for prep, painting, and finishing.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=21)
        )
        
        Task.objects.create(
            project=project1,
            title='Install polished concrete flooring',
            description='Polished concrete flooring throughout 1,500 sq ft main living space. Process includes: grinding existing concrete slab, filling any cracks or imperfections common in Lagos construction, progressive polishing with diamond pads (up to 3000 grit), densifier application, and stain-resistant sealer suitable for tropical climate. Final finish will be smooth matte surface with subtle sheen that highlights natural concrete variations. Must coordinate with existing exposed ductwork and electrical conduits. Work schedule must account for Lagos power supply - generator backup required. Requires 5-7 days including cure time between steps.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=28)
        )
        
        Task.objects.create(
            project=project1,
            title='Custom steel and wood staircase with geometric railing',
            description='Working with Chisom Okafor (Okafor Metalworks) for industrial-style staircase railing. Design features geometric triangular pattern in matte black powder-coated steel with custom walnut handrail. All steel components will be fabricated in Chisom\'s Owerri workshop to exact site measurements. Welded joints will be ground smooth for seamless appearance. Walnut handrail custom-milled for ergonomic comfort, attached with concealed fasteners. Powder coating must be weather-resistant for Lagos climate. This will transform the stairway into a sculptural design element. Requires 4 weeks for fabrication plus 2 days on-site installation. Factor in shipping time from Owerri to Lagos.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=35)
        )
        
        Task.objects.create(
            project=project1,
            title='Smart home system integration with backup power',
            description='Install and configure smart lighting control system throughout loft with critical backup power integration. Includes: smart switches and dimmers for all lighting zones compatible with frequent power fluctuations, motorized window shades for floor-to-ceiling windows, integration with smart thermostat and security system. Program multiple scenes for different times of day and activities (work, entertaining, movie night, sleep). Critical: ensure all smart devices work seamlessly with generator and inverter systems common in Lagos homes. Provide client training on system operation via app and voice control. Coordinate with electrician for low-voltage wiring. 3-4 days for installation and programming.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=42)
        )
        
        # Project 2: Lakeside Villa Abuja - Tasks
        Task.objects.create(
            project=project2,
            title='Finalize lakeside-inspired color palette',
            description='Complete paint color selection for entire 3,500 sq ft villa. Creating cohesive palette inspired by Jabi Lake environment and Abuja landscape: soft blues for bedrooms reflecting the lake, warm earth tones for main living areas inspired by Abuja\'s rocky terrain, sandy neutrals for hallways, and sage green for study reflecting Nigerian vegetation. Testing large samples in actual spaces to see how Abuja\'s intense sunlight affects colors throughout the day. Will specify premium paint suitable for Abuja\'s dry climate. Need final approval before ordering paint and scheduling painters. Includes consultation with clients and providing mood boards with Nigerian context.',
            status='in_progress',
            due_date=datetime.now().date() + timedelta(days=25)
        )
        
        Task.objects.create(
            project=project2,
            title='Custom built-in window seats with storage',
            description='Coordinate with Oluwaseun Adeyemi for custom window seats in master bedroom and living room (total 3 locations). Each features: white oak construction matching flooring, hinged tops for hidden storage, comfortable cushioning with durable fabric suitable for Abuja climate, and integration with existing window trim. Living room seat will be 8 feet long with divided storage compartments. Master bedroom seats (2) will be 5 feet each flanking windows with lake views. Wood treatment must account for Abuja\'s dry season and harmattan. Includes coordination with upholsterer for cushions. 4-6 weeks for fabrication. Shipping from Lagos to Abuja via trusted logistics company.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=60)
        )
        
        Task.objects.create(
            project=project2,
            title='White oak flooring installation - entire main level',
            description='Install 5-inch wide-plank white oak flooring throughout 2,200 sq ft main level. Wood selected for light, consistent grain that complements lakeside aesthetic. Custom stain mixture creates soft, natural finish - neither too yellow nor too gray. Wood must be properly treated for Abuja\'s climate variations. Includes: proper acclimation period in Abuja climate, professional installation with careful attention to transitions between rooms and to tile in wet areas, and 3 coats water-based polyurethane (matte finish) with UV protection. Coordinate with other trades. Factor in harmattan season considerations. Allow 2-3 weeks total.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=80)
        )
        
        # Project 3: VI Apartment - Tasks
        Task.objects.create(
            project=project3,
            title='Install herringbone white oak flooring',
            description='Coordinate with Emeka Okoro (Okoro Flooring Experts) for herringbone pattern white oak flooring throughout main living areas (900 sq ft). Each 3-inch wide plank precision-cut at 45-degree angles and laid in traditional herringbone pattern. Pattern will be centered in each room for visual balance. Custom warm gray stain to complement minimalist aesthetic and hide Lagos dust better. Wood must be properly sealed for Victoria Island\'s coastal humidity. Finished with 3 coats water-based matte polyurethane with mold resistance. Requires expert precision - Emeka is perfect for this despite the distance from Enugu. Material is already ordered and acclimating in Lagos. Installation estimated at 1.5-2 weeks.',
            status='in_progress',
            due_date=datetime.now().date() + timedelta(days=12)
        )
        
        Task.objects.create(
            project=project3,
            title='Reupholster dining chairs in gray velvet',
            description='Working with Blessing Nwosu (Nwosu Upholstery) to reupholster client\'s existing set of 6 dining chairs. New fabric: high-quality gray velvet with stain-resistant treatment (essential for Lagos lifestyle). Includes: removing old fabric/padding, inspecting and repairing frames as needed (important given Lagos humidity damage), new high-density foam padding, and professional reupholstery with clean, modern lines. This will transform dated chairs into contemporary pieces that work with new aesthetic. Blessing will provide fabric samples for approval - sourcing quality velvet in Nigeria can be challenging but she has excellent suppliers. Estimated 3-4 weeks in her Port Harcourt workshop. Arrange reliable shipping to Lagos.',
            status='in_progress',
            due_date=datetime.now().date() + timedelta(days=10)
        )
        
        Task.objects.create(
            project=project3,
            title='Install modern pendant lights and LED system',
            description='Coordinate with Yusuf Ibrahim (Ibrahim Lighting Design) for complete lighting plan optimized for Lagos power challenges. Scope includes: 3 modern glass pendants over dining table, 2 pendants over kitchen island, energy-efficient LED recessed lighting in living room and bedroom (dimmable, 2700K warm white suitable for Lagos heat), and under-cabinet LED strips in kitchen. All fixtures must be compatible with voltage fluctuations. All on separate dimmer switches, some integrated with smart system that works with inverter backup. Yusuf will program lighting scenes for different times of day. Installation plus programming will take 2-3 days. Shipping from Kaduna to Lagos arranged.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=18)
        )
        
        Task.objects.create(
            project=project3,
            title='Custom closet organization system',
            description='Built-in closet system for master bedroom maximizing storage in compact VI apartment. Custom white oak design includes: double hanging rods, dedicated shoe storage (holds 24 pairs), pull-out jewelry tray, built-in hamper, and drawer stack for folded items. LED lighting integrated into top shelf with battery backup. Design maximizes every inch while maintaining clean, minimalist appearance - critical in Lagos apartments. All materials must be treated to resist mold in coastal humidity. All materials and hardware premium quality. Fabrication and installation 2-3 weeks. Consider Lagos traffic for installation timing.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=25)
        )
        
        Task.objects.create(
            project=project3,
            title='Custom window seat with storage - living room',
            description='Built-in window seat creating cozy reading nook and maximizing storage - essential in compact Lagos apartments. White oak construction with hinged cushioned top (gray fabric matching chairs, mold-resistant), two internal compartments for books/blankets, and integration with existing baseboard and trim details. Cushion will be comfortable for extended sitting and breathable for Lagos climate. Wood treatment includes humidity protection. Perfect use of otherwise wasted space under window with Atlantic Ocean views. 3 weeks for fabrication and installation.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=30)
        )
        
        # Project 4: Restaurant Wuse 2 (Completed) - Tasks
        Task.objects.create(
            project=project4,
            title='Final walkthrough and punch list completion',
            description='Completed final walkthrough with restaurant owner Chef Emeka and addressed all punch list items. Inspected all custom elements: live-edge mahogany bar top from local sawmill (minor finish touch-up completed), booth seating (perfect - fabric holding up well in Abuja climate), lighting installation (adjusted two fixture heights for better ambiance), and plant wall featuring local Nigerian species (added supplemental grow lights and irrigation system). Verified all kitchen equipment functioning with generator backup, acoustical panels properly installed for Nigerian dining noise levels, and decorative tile work with African patterns properly sealed. Restaurant passed final Abuja municipal inspection and opened on schedule! Client thrilled with results - already getting Instagram buzz and features in Abuja lifestyle blogs. The Afropolitan Kitchen is becoming a dining destination!',
            status='done',
            due_date=datetime.now().date() - timedelta(days=8)
        )
        
        Task.objects.create(
            project=project4,
            title='Install custom upholstered booth seating',
            description='Completed custom booth seating for dining area. Blessing Nwosu fabricated 6 booths with channel tufting in durable restaurant-grade vinyl (looks like leather but easier to clean and maintains better in Abuja climate). Each booth built with solid wood frames treated for humidity resistance, high-density foam rated for commercial use, and stain-resistant upholstery that can withstand heavy restaurant traffic. Booths installed along two walls creating intimate dining spaces perfect for Nigerian business lunches and family dinners. Coordinated with custom tables sized perfectly for booth spacing. Client loves the comfort and style - perfect balance of durability and design. Shipping from Port Harcourt to Abuja went smoothly.',
            status='done',
            due_date=datetime.now().date() - timedelta(days=20)
        )
        
        Task.objects.create(
            project=project4,
            title='Hand-forged pendant light fixtures installation',
            description='Chisom Okafor created stunning hand-forged steel pendant lights for restaurant with African-inspired design elements. 12 total fixtures installed over bar, communal table, and throughout dining room. Each one unique with hammered texture and aged brass finish reflecting traditional Nigerian metalwork. Fixtures house energy-efficient LED bulbs for warm ambient light (important for Abuja\'s electricity costs). Installation coordinated with electrician for proper height, spacing, and dimming capability that works with restaurant\'s generator system. These lights are real showpieces - customers constantly ask about them and they\'ve been featured in design blogs! Shipping from Owerri handled professionally.',
            status='done',
            due_date=datetime.now().date() - timedelta(days=35)
        )
        
        # Project 5: Luxury Penthouse Ikoyi - Tasks
        Task.objects.create(
            project=project5,
            title='Custom kitchen island with imported marble',
            description='Large marble-topped island (10 feet x 4 feet) serving as kitchen focal point in this Ikoyi penthouse. Italian Calacatta marble with dramatic veining selected by client during their Europe trip. Island includes: integrated seating for 4, wine fridge, warming drawer, and custom storage drawers. Base cabinetry in high-gloss white lacquer. Requires expert templating accounting for Lagos humidity, precise fabrication, and careful installation due to marble weight, cost, and import logistics. Coordinating with Italian stone supplier for shipping through Lagos ports - requires customs clearance coordination. Marble must be properly sealed for coastal climate. 6-8 weeks lead time including shipping and customs.',
            status='in_progress',
            due_date=datetime.now().date() + timedelta(days=30)
        )
        
        Task.objects.create(
            project=project5,
            title='Smart home automation with power backup integration',
            description='Whole-home automation system installation throughout 4,000 sq ft Ikoyi penthouse with critical uninterrupted power backup. System controls: all lighting (including custom scenes), motorized window shades with ocean views, multi-room audio/video, climate control optimized for Lagos weather, and comprehensive security system. CRITICAL: Full integration with building\'s backup generator and client\'s dedicated inverter system to ensure zero interruption during NEPA outages. Custom touch panels in each room plus full iPad and smartphone app control that works on Nigerian internet speeds. Programming requires extensive configuration of scenes, schedules, and user preferences. Includes comprehensive client training with focus on backup power management. Professional integration firm with Lagos experience handling installation and programming. 3-4 weeks for installation and programming.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=50)
        )
        
        Task.objects.create(
            project=project5,
            title='Master bathroom Italian marble installation',
            description='Luxury master bathroom with floor-to-ceiling Italian marble (Statuario) creating spa-worthy sanctuary overlooking the Atlantic. Includes: walk-in steam shower with marble walls and ceiling, freestanding soaking tub surround, double vanity counters, and heated flooring. All marble book-matched for continuous veining creating dramatic effect. Requires expert templating, fabrication, and installation by specialists experienced with luxury Lagos projects. Waterproofing absolutely critical for steam shower in coastal humidity - must use best-in-class systems. Coordinating with plumber for imported fixtures and ensuring compatibility with Lagos water pressure. Marble requires special sealing for coastal environment. This bathroom will rival five-star hotels. 4 weeks for templating, fabrication, and installation.',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=65)
        )
        
        # Project 6: Boutique Hotel Calabar - Tasks  
        Task.objects.create(
            project=project6,
            title='Custom reception desk - local mahogany',
            description='Statement reception desk for hotel lobby featuring live-edge mahogany slab from Cross River State sawmill, celebrating local timber. Working with Oluwaseun Adeyemi on design that balances organic edge with functional requirements (computer storage, file drawers, cable management for Nigerian power systems). Desk will be 8 feet long with blackened steel base fabricated in collaboration with local Calabar metalworker. Mahogany carefully selected for dramatic grain and natural edge that creates wow factor for guest check-in experience while showcasing Nigerian craftsmanship. Wood treatment must account for Calabar\'s high humidity. 6-8 weeks for design, fabrication, and installation. Celebrating local materials and makers!',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=50)
        )
        
        Task.objects.create(
            project=project6,
            title='Statement chandelier - Calabar carnival inspired',
            description='Dramatic chandelier for double-height lobby space (20-foot ceilings) inspired by the famous Calabar Carnival. Custom piece by regional lighting artist from Akwa Ibom featuring hand-blown glass in vibrant colors and brass accents reflecting carnival energy. Fixture is 6 feet in diameter - substantial enough for dramatic space. Design incorporates traditional motifs celebrating Cross River culture. Installation requires lift equipment and coordination with electrician for proper structural support and wiring that works with hotel\'s backup power system. Fixture will be focal point visible from street through windows - attracting guests inside and celebrating Nigerian creativity. Lead time 8 weeks for artisan fabrication, installation 1 day. This will become an Instagram landmark in Calabar!',
            status='todo',
            due_date=datetime.now().date() + timedelta(days=70)
        )
        
        self.stdout.write('Creating moodboards...')
        # Moodboard 1: Industrial Loft Living Space - Lekki
        moodboard1 = Moodboard.objects.create(
            project=project1,
            title='Industrial Modern Living - Lekki Aesthetic',
            description='Curated inspiration for the main open-concept living area in Lekki Phase 1. Celebrating raw industrial materials - exposed brick, concrete, steel - balanced with warm Nigerian textures like leather, locally-woven textiles, and native wood. The aesthetic blends urban Lagos edge with comfortable, livable design suitable for tropical climate. Color palette centers on warm grays, natural wood tones, black steel, and cognac leather accents with touches inspired by Lagos sunsets.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard1,
            image='https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800',
            # notes='Cognac leather sofa - main seating focal point, durable for Lagos climate',
            x=20,
            y=20,
            width=380,
            height=280
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard1,
            image='https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
            # notes='Industrial pendant lights with energy-efficient LED bulbs',
            x=420,
            y=20,
            width=300,
            height=280
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard1,
            image='https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
            # notes='Exposed brick accent wall texture - sealed for Lagos humidity',
            x=20,
            y=320,
            width=280,
            height=200
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard1,
            image='https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
            # notes='Blackened steel and wood staircase detail by Nigerian artisan',
            x=320,
            y=320,
            width=300,
            height=200
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard1,
            image='https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
            # notes='Polished concrete floor finish - practical for Lagos',
            x=640,
            y=320,
            width=280,
            height=200
        )
        
        # Moodboard 2: Industrial Loft Kitchen - Lekki
        moodboard2 = Moodboard.objects.create(
            project=project1,
            title='Custom Kitchen Design - Nigerian Industrial Warmth',
            description='Kitchen design combining industrial elements with warm, natural Nigerian materials. Custom walnut cabinets by Lagos artisan provide organic warmth against concrete and steel. Open shelving displays curated Nigerian ceramics and cookware. Brass hardware and fixtures add subtle elegance. The kitchen balances serious cooking functionality (important for Nigerian cuisine) with stunning aesthetics, while accounting for Lagos humidity and power considerations.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard2,
            image='https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
            # notes='Custom walnut cabinet inspiration by Adeyemi Carpentry',
            x=30,
            y=30,
            width=400,
            height=300
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard2,
            image='https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
            # notes='Brass hardware and fixtures - corrosion resistant for coastal Lagos',
            x=450,
            y=30,
            width=250,
            height=300
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard2,
            image='https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
            # notes='Open shelving with Nigerian ceramics and cookware display',
            x=30,
            y=350,
            width=300,
            height=240
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard2,
            image='https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800',
            # notes='Integrated wine storage detail with climate control for Lagos heat',
            x=350,
            y=350,
            width=350,
            height=240
        )
        
        # Moodboard 3: Lakeside Villa Abuja
        moodboard3 = Moodboard.objects.create(
            project=project2,
            title='Lakeside Serenity - Abuja Natural Palette',
            description='Serene palette inspired by Jabi Lake and Abuja\'s natural landscape. Soft blues evoke the lake and Abuja sky, warm earth tones reflect the rocky terrain, natural textures from local stone and vegetation. The palette creates calm, restorative atmosphere perfect for lakeside living in Nigeria\'s capital. Materials are durable enough for Abuja\'s climate variations (dry season and rainy season) while maintaining refined aesthetic that celebrates Nigerian landscape.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard3,
            image='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
            # notes='Serene bedroom with natural linen bedding - breathable for Abuja climate',
            x=25,
            y=25,
            width=450,
            height=320
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard3,
            image='https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800',
            # notes='Lake-inspired blues and earth tones from Abuja landscape',
            x=495,
            y=25,
            width=280,
            height=320
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard3,
            image='https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800',
            # notes='Natural textures - locally sourced rattan, linen, jute',
            x=25,
            y=365,
            width=350,
            height=250
        )

        MoodboardItem.objects.create(
            moodboard=moodboard3,
            image='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
            # notes='White oak flooring with natural finish - treated for Abuja climate',
            x=395,
            y=365,
            width=380,
            height=250
        )
        
        # Moodboard 4: Minimalist VI Condo
        moodboard4 = Moodboard.objects.create(
            project=project3,
            title='Minimalist VI Living - Lagos Sophistication',
            description='Modern minimalist aesthetic for young Lagos professional. Clean lines, neutral palette, and natural materials create timeless, calming environment - a peaceful retreat from busy Victoria Island life. Every piece carefully selected and purposeful. Warm wood accents prevent the space from feeling cold. Materials chosen to withstand coastal humidity. The goal is sophisticated simplicity that allows the owner to focus and relax after navigating Lagos hustle.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard4,
            image='https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
            # notes='Minimalist living room with clean lines - low maintenance for Lagos lifestyle',
            x=40,
            y=40,
            width=360,
            height=260
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard4,
            image='https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
            # notes='Herringbone wood floor pattern by Enugu flooring expert',
            x=420,
            y=40,
            width=320,
            height=260
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard4,
            image='https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
            # notes='Warm wood accent furniture - humidity resistant treatments',
            x=40,
            y=320,
            width=340,
            height=260
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard4,
            image='https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800',
            # notes='Gray velvet upholstery - stain resistant for Lagos living',
            x=400,
            y=320,
            width=340,
            height=260
        )
        
        # Moodboard 5: Luxury Penthouse Ikoyi
        moodboard5 = Moodboard.objects.create(
            project=project5,
            title='Ikoyi Luxury - Nigerian Elite Elegance',
            description='High-end materials and finishes for sophisticated Ikoyi penthouse befitting Nigeria\'s business elite. Italian marble, custom millwork by Nigerian artisans, imported fabrics, and designer furniture blend international luxury with local craftsmanship. Every detail considered - from door hardware to automated systems. The aesthetic is elegant but not ostentatious, modern but timeless, with touches that celebrate Nigerian culture. Materials selected for both beauty and durability in coastal Lagos climate.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard5,
            image='https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
            # notes='Calacatta marble with dramatic veining - imported via Lagos ports',
            x=30,
            y=30,
            width=400,
            height=300
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard5,
            image='https://images.unsplash.com/photo-1618219878071-90c4afd9dd2e?w=800',
            # notes='High-gloss white lacquer cabinetry - humidity resistant finish',
            x=450,
            y=30,
            width=320,
            height=300
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard5,
            image='https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
            # notes='Master bathroom with spa aesthetic - Atlantic Ocean views',
            x=30,
            y=350,
            width=370,
            height=280
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard5,
            image='https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
            # notes='Custom upholstered furniture - blend of Nigerian and international design',
            x=420,
            y=350,
            width=350,
            height=280
        )
        
        # Moodboard 6: Boutique Hotel Calabar
        moodboard6 = Moodboard.objects.create(
            project=project6,
            title='Calabar Heritage - Celebrating Cross River Artisans',
            description='Design celebrating Cross River makers and local craftsmanship. Custom furniture by Calabar and Akwa Ibom artisans, artwork by regional artists, materials sourced from Cross River suppliers. The design creates a unique sense of place that celebrates Nigerian hospitality and cultural richness. Warm, welcoming atmosphere that feels authentically Nigerian and Instagram-worthy. Color palette inspired by Calabar Carnival and natural beauty of Cross River State.'
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard6,
            image='https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800',
            # notes='Live-edge mahogany reception desk from Cross River sawmill',
            x=20,
            y=20,
            width=380,
            height=280
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard6,
            image='https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
            # notes='Statement lighting inspired by Calabar Carnival - local artisan',
            x=420,
            y=20,
            width=350,
            height=280
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard6,
            image='https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
            # notes='Locally sourced Nigerian hardwood flooring',
            x=20,
            y=320,
            width=340,
            height=260
        )
        
        MoodboardItem.objects.create(
            moodboard=moodboard6,
            image='https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800',
            # notes='Hand-woven textiles by Cross River and Akwa Ibom weavers',
            x=380,
            y=320,
            width=390,
            height=260
        )
        
        self.stdout.write(self.style.SUCCESS('\n✅ Successfully seeded database with comprehensive Nigeria-centric data!\n'))
        self.stdout.write('═' * 80)
        self.stdout.write(f'📊 Database Summary:')
        self.stdout.write(f'  👥 {User.objects.count()} users (3 designers, 2 clients, 6 artisans)')
        self.stdout.write(f'  🏷️  {ServiceCategory.objects.count()} service categories')
        self.stdout.write(f'  🔨 {ArtisanProfile.objects.count()} artisan profiles (all verified & featured)')
        self.stdout.write(f'  🖼️  {PortfolioItem.objects.count()} portfolio items (Nigeria-focused descriptions)')
        self.stdout.write(f'  ⭐ {Review.objects.count()} reviews (realistic Nigerian context)')
        self.stdout.write(f'  📁 {Project.objects.count()} projects (Nigerian locations & budgets in Naira)')
        self.stdout.write(f'  ✅ {Task.objects.count()} tasks (Nigeria-specific considerations)')
        self.stdout.write(f'  🎨 {Moodboard.objects.count()} moodboards')
        self.stdout.write(f'  🖼️  {MoodboardItem.objects.count()} moodboard items (with Nigerian context notes)')
        self.stdout.write('═' * 80)
        self.stdout.write('\n🔐 Login Credentials (password: password123):\n')
        self.stdout.write('DESIGNERS:')
        self.stdout.write('  📧 adaeze.okonkwo@example.com - Lagos-based, 2 active projects')
        self.stdout.write('  📧 chidi.nnamdi@example.com - Abuja-based, 2 projects (1 completed)')
        self.stdout.write('  📧 amina.yusuf@example.com - Lagos-based, 2 active projects')
        self.stdout.write('\nARTISANS (All Verified):')
        self.stdout.write('  📧 oluwaseun.adeyemi@example.com - Carpentry, Lagos (₦42,500/hr, 4 portfolio items)')
        self.stdout.write('  📧 fatima.bello@example.com - Painting, Abuja (₦32,500/hr, 4 portfolio items)')
        self.stdout.write('  📧 emeka.okoro@example.com - Flooring, Enugu (₦37,500/hr, 3 portfolio items)')
        self.stdout.write('  📧 blessing.nwosu@example.com - Upholstery, Port Harcourt (₦35,000/hr, 3 portfolio items)')
        self.stdout.write('  📧 yusuf.ibrahim@example.com - Lighting, Kaduna (₦40,000/hr, 2 portfolio items)')
        self.stdout.write('  📧 chisom.okafor@example.com - Metalwork, Owerri (₦45,000/hr, 3 portfolio items)')
        self.stdout.write('\nCLIENTS:')
        self.stdout.write('  📧 ngozi.eze@example.com - Ikoyi, Lagos')
        self.stdout.write('  📧 tunde.adebayo@example.com - Ibadan')
        self.stdout.write('═' * 80)
        self.stdout.write('\n💡 Features of this Nigeria-centric seed data:')
        self.stdout.write('  ✓ Real Nigerian locations: Lagos, Abuja, Enugu, Port Harcourt, Kaduna, Owerri, Calabar')
        self.stdout.write('  ✓ Budgets in Nigerian Naira (₦)')
        self.stdout.write('  ✓ Climate considerations (humidity, harmattan, rainy season)')
        self.stdout.write('  ✓ Power backup and NEPA considerations in smart home systems')
        self.stdout.write('  ✓ Local materials (mahogany, local hardwoods, Nigerian textiles)')
        self.stdout.write('  ✓ Cultural references (Calabar Carnival, Nigerian art, local craftsmanship)')
        self.stdout.write('  ✓ Realistic Nigerian logistics (Lagos traffic, inter-state shipping)')
        self.stdout.write('  ✓ Nigerian names and business contexts')
        self.stdout.write('  ✓ Coastal vs. inland climate considerations')
        self.stdout.write('  ✓ Integration with backup power systems (generators, inverters)')
        self.stdout.write('═' * 80 + '\n')